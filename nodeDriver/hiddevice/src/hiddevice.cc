#include "hiddevice.h"


// This GUID is for all USB serial host PnP drivers, but you can replace it 
// with any valid device class guid.
GUID WceusbshGUID = { 0x25dbce51, 0x6c8f, 0x4a72, 
                      0x8a,0x6d,0xb5,0x4c,0x2b,0x4f,0xc8,0x35 };


HWND hWnd;

HANDLE hid_thread;
DWORD threadId;
DWORD WINAPI ListenerThread(LPVOID lpParam);

HANDLE devicePNPEvent;
HANDLE keyDataEvent = NULL;
HANDLE ApplicationRegisteredEvent = NULL;

uint32_t keyDataFlag = 0;

//Device PNP
void NotifyAsync(uv_work_t* req);
void NotifyFinished(uv_work_t* req);

//Message callback
void CallbackAsync(uv_work_t* req);
void CallbackFinished(uv_work_t* req);

//Keyboard key 
void KeyDataAsync(uv_work_t* req);
void KeyDataFinished(uv_work_t* req);

//Keyboard key 
void AppEventAsync(uv_work_t* req);
void AppEventFinished(uv_work_t* req);


using namespace v8;


#define DEBUG_HEADER fprintf(stderr, "System [%s:%s() %d]: ", __FILE__, __FUNCTION__, __LINE__); 
#define DEBUG_FOOTER fprintf(stderr, "\n");
#define DEBUG_LOG(...) DEBUG_HEADER fprintf(stderr, __VA_ARGS__); DEBUG_FOOTER

Persistent<Value> HIDPNPCallback;
Persistent<Value> DebugMessageCallback;
Persistent<Value> KeyboardDataCallback;
Persistent<Value> AppEventCallback;


typedef struct _DEVICE_READ_DATA{
  INT size;
  UCHAR Data[255];
  Persistent<Value> DeviceDataCallback;
  uv_thread_t thread;
  hid_device *h_datadevice;
} DEVICE_READ_DATA, *PDEVICE_READ_DATA;

//hidapi
hid_device* h_hiddevice;      //feature 64  byte
hid_device* h_hiddevice_484;      //feature 484 byte
hid_device* h_out_hiddevice;  //output

DEVICE_READ_DATA device_ep3_info;

namespace hiddevice {
  
  using v8::Function;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Null;
  using v8::Object;
  using v8::String;
  using v8::Value;


  void ReadHidData(DEVICE_READ_DATA *hidData);
  UVQueue<DEVICE_READ_DATA *> completionQueue(ReadHidData);

  void HidCallback(PDEVICE_ATTRIBUTES deviceInfo)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    
    Local<Object> device = Object::New(isolate);
    device->Set(String::NewFromUtf8(isolate, "vid"), Integer::New(isolate, deviceInfo->VendorID));
    device->Set(String::NewFromUtf8(isolate, "pid"), Integer::New(isolate, deviceInfo->ProductID));
    device->Set(String::NewFromUtf8(isolate, "status"), Integer::New(isolate, deviceInfo->Status));

    Handle<Value> argv[1] = {device};
    
    Local<Value> cbVal=Local<Value>::New(isolate, HIDPNPCallback);
    Local<Function> cb = Local<Function>::Cast(cbVal);
    cb->Call(isolate->GetCurrentContext()->Global(), 1, argv);
  }

  void MessageCallBack(TCHAR * message)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    Handle<Value> argv[1] = { String::NewFromUtf8(isolate, message) };
    
    Local<Value> cbVal = Local<Value>::New(isolate, DebugMessageCallback);
    Local<Function> cb = Local<Function>::Cast(cbVal);
    cb->Call(isolate->GetCurrentContext()->Global(), 1, argv);
  }


  void KeyDataCallback(PKEYBOARD_KEYDATA keyStatus)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    
    Local<Object> key = Object::New(isolate);
    key->Set(String::NewFromUtf8(isolate, "vKey"), Integer::New(isolate, keyStatus->vKey));
    key->Set(String::NewFromUtf8(isolate, "MakeMode"), Integer::New(isolate, keyStatus->MakeCode));
    key->Set(String::NewFromUtf8(isolate, "Flag"), Integer::New(isolate, keyStatus->Flag));
    key->Set(String::NewFromUtf8(isolate, "keyStatus"), Integer::New(isolate, keyStatus->keyStatus));

    Handle<Value> argv[1] = {key};
    
    Local<Value> cbVal=Local<Value>::New(isolate, KeyboardDataCallback);
    Local<Function> cb = Local<Function>::Cast(cbVal);
    cb->Call(isolate->GetCurrentContext()->Global(), 1, argv);
  }


  void AppCallback()
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

  
    TCHAR appPath[MAX_PATH] = {0};
    HWND hWnd = GetForegroundWindow();

    HMODULE module = NULL;
    DWORD pid = 0;
    DWORD need = 0;
    GetWindowThreadProcessId(hWnd,&pid);

    if(pid != 0)
    {   
        HANDLE process = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, pid); 
        if (NULL != process) 
        {
            EnumProcessModules(process, &module, sizeof(module), &need);
            GetModuleFileNameEx( process, module, appPath, MAX_PATH); 
            DEBUG_LOG("GetModuleFileNameEx:%s", appPath);   

            if((StrStrI(appPath,"ApplicationFrameWindow")) || (StrStrI(appPath,"WWAHost")))
            {
              //Windows 10 application
              DEBUG_LOG("Windows 10 application..."); 

            }
            else 
            {
              //send to UI
              Handle<Value> argv[1] = { String::NewFromUtf8(isolate, appPath) };
    
              Local<Value> cbVal = Local<Value>::New(isolate, AppEventCallback);
              Local<Function> cb = Local<Function>::Cast(cbVal);
              cb->Call(isolate->GetCurrentContext()->Global(), 1, argv);
            }
        }
    }

   
  }

  void AppEventAsync(uv_work_t* req) {
    WaitForSingleObject(ApplicationRegisteredEvent, INFINITE);
  }

  void AppEventFinished(uv_work_t* req) {

    // TCHAR * appPath = static_cast<TCHAR *>(req->data);
    AppCallback();

    uv_queue_work(uv_default_loop(), req, AppEventAsync, (uv_after_work_cb)AppEventFinished);
  }


  void CallbackAsync(uv_work_t* req) {
    // WaitForSingleObject(devicePNPEvent, INFINITE);
  }

  void CallbackFinished(uv_work_t* req) {

    TCHAR * msg = static_cast<TCHAR *>(req->data);
    MessageCallBack(msg);
  }

  void DebugMessage(TCHAR * msg)
  {
    uv_work_t* req = new uv_work_t();
    req->data = msg;
    uv_queue_work(uv_default_loop(), req, CallbackAsync, (uv_after_work_cb)CallbackFinished);

  }

  void NotifyAsync(uv_work_t* req) {
    WaitForSingleObject(devicePNPEvent, INFINITE);
  }

  void NotifyFinished(uv_work_t* req) {

    PDEVICE_ATTRIBUTES device = (PDEVICE_ATTRIBUTES)req->data;

    HidCallback(device);
  }
  
  void NotifyHidDevicePNP(PDEV_BROADCAST_DEVICEINTERFACE info, bool status)
  {
    DEVICE_ATTRIBUTES *device = new DEVICE_ATTRIBUTES;
    TCHAR dbccName[512] = {0};
    
    memcpy(dbccName, info->dbcc_name, 512);
    
    DebugMessage(dbccName);

    // //Find VID
    char *VID = strstr(dbccName, "VID_");
    char *PID = strstr(dbccName, "PID_");

    char tmpVID[5] = {0};
    if(VID != NULL)
    {
      tmpVID[4] = '\0';
      strncpy(tmpVID, VID+strlen("VID_"), 4);
      device->VendorID = strtol(tmpVID, 0, 16);
    }

    // //Find PID
    char tmpPID[5] = {0};
    if(PID != NULL)
    {
      tmpPID[4] = '\0';
      strncpy(tmpPID, PID+strlen("PID_"), 4);
      device->ProductID = strtol(tmpPID, 0, 16);
      
    }
    //  device->VendorID = 0x195D;
    //  device->ProductID = 0x2061;


    if(status == true)
      device->Status = 1;
    else
      device->Status = 0;
    
    SetEvent(devicePNPEvent);

    uv_work_t* req = new uv_work_t();
    req->data = device;
    uv_queue_work(uv_default_loop(), req, NotifyAsync, (uv_after_work_cb)NotifyFinished);
  }

  void KeyDataAsync(uv_work_t* req) {
    WaitForSingleObject(keyDataEvent, INFINITE);
  }

  void KeyDataFinished(uv_work_t* req) {

    PKEYBOARD_KEYDATA keyData = (PKEYBOARD_KEYDATA)req->data;

    KeyDataCallback(keyData);
  }

  void NotifyKeyData(PKEYBOARD_KEYDATA keyData)
  {
    // KEYBOARD_KEYDATA keyData *key = new KEYBOARD_KEYDATA;

    SetEvent(keyDataEvent);

    uv_work_t* req = new uv_work_t();
    req->data = keyData;
    uv_queue_work(uv_default_loop(), req, KeyDataAsync, (uv_after_work_cb)KeyDataFinished);
  }

  

  void RunDebugCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    DebugMessageCallback.Reset(isolate, args[0]);
  } 

  void RunHidCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    HIDPNPCallback.Reset(isolate,args[0]);
  }

  void RunKeyboardDataCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();


    keyDataFlag = (long)args[0]->IntegerValue();
    //capture key data
    // uint32_t flag = (short)args[0]->Int32Value();

    // keyDataFlag = flag;


    if(keyDataEvent == NULL)
    {
      RAWINPUTDEVICE Rid[1];

      Rid[0].usUsagePage=0x01;  //-- standard
      Rid[0].usUsage=0x06;
      Rid[0].dwFlags=RIDEV_INPUTSINK;
      Rid[0].hwndTarget=hWnd;

      if (RegisterRawInputDevices(Rid,1,sizeof(Rid[0])) == FALSE)
      {
        DebugMessage("RegisterRawInputDevices fails...");
      }
      else
        DebugMessage("RegisterRawInputDevices success...");


      keyDataEvent = CreateEvent(NULL, false , true , "");
    }

    KeyboardDataCallback.Reset(isolate, args[1]);

  } 


  void CALLBACK HandleAppEvent(HWINEVENTHOOK hook, DWORD event, HWND hwnd,LONG idObject, LONG idChild,DWORD dwEventThread, DWORD dwmsEventTime){
	
	if (event == EVENT_SYSTEM_FOREGROUND)
    {
        DEBUG_LOG("EVENT_SYSTEM_FOREGROUND......");
        Sleep(500);
        SetEvent(ApplicationRegisteredEvent);
    }
    
}


  void HIDReadThreadFn(void* arr)
  {
    int rtn = 0;
     unsigned char ReadBuffer[64];    
    
    DEVICE_READ_DATA * _hidInfo = (DEVICE_READ_DATA *)arr;

    DEBUG_LOG("_hidHandle:%p", _hidInfo->h_datadevice);
    while(_hidInfo->h_datadevice)
    {
      memset(_hidInfo->Data, 0, sizeof(_hidInfo->Data));
      rtn = hid_read(_hidInfo->h_datadevice, _hidInfo->Data, sizeof(_hidInfo->Data));
      if(rtn > 0){

        // char msg[255];
         //sprintf(msg,"hid_read length : %d.",rtn);
          DEBUG_LOG("ReadBufferlength:%d, data:%x,%x,%x,%x,%x,%x,%x,%x", rtn, ReadBuffer[0],ReadBuffer[1],ReadBuffer[2],ReadBuffer[3],ReadBuffer[4],ReadBuffer[5],ReadBuffer[6],ReadBuffer[7]);
        _hidInfo->size = rtn;
        completionQueue.ref();
        completionQueue.post(_hidInfo);
      }
      Sleep(20);
    }

    // trans->HidHandle = NULL;
    DEBUG_LOG("TransferThreadFn Exit : %p", _hidInfo->h_datadevice);
  }


  void ReadHidData(DEVICE_READ_DATA * hidData)
  {
      Isolate* isolate = Isolate::GetCurrent();
      HandleScope scope(isolate);
      completionQueue.unref();

      Local<Value> cbVal=Local<Value>::New(isolate, hidData->DeviceDataCallback);
      Local<Function> cb = Local<Function>::Cast(cbVal);
      const unsigned argc = 1;

      Local<Object> buf  = node::Buffer::Copy(isolate, (char *)hidData->Data, hidData->size).ToLocalChecked();

      Local<Value> argv[argc] = { buf };

      DEBUG_LOG("buf : ,%x, %x, %x, %x, %x, %x, %x, %x, %x, %x, %x", hidData->Data[0], hidData->Data[1], hidData->Data[2], hidData->Data[3], hidData->Data[4], hidData->Data[5], hidData->Data[6], hidData->Data[7], hidData->Data[8], hidData->Data[9], hidData->Data[10] );
      
      cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
  }



  void RunDeviceDataCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    // DeviceDataCallback.Reset(isolate, args[0]);


      uint32_t dev_usagePage = (long)args[0]->IntegerValue();
      uint32_t dev_usage = (long)args[1]->IntegerValue();
      // uint32_t interface = (short)args[2]->Int32Value();

      bool rtn = false;
      // TCHAR msg[512] = {0};

      struct hid_device_info *devs, *cur_dev;
      char dev_ep3path[1024] = {0};

      devs = hid_enumerate(6493, 8289);

      cur_dev = devs;	
     
      while (cur_dev) {
          DEBUG_LOG("Device Found EP3 type: %04hx %04hx  usage_page: %d  usage: %d, interface_number: %d\n", cur_dev->vendor_id, cur_dev->product_id, cur_dev->usage_page, cur_dev->usage, cur_dev->interface_number);
        //if(cur_dev->usage_page == dev_usagePage && cur_dev->usage == dev_usage)
        if(cur_dev->usage_page == 0xFF00 && cur_dev->usage == 0xFF00)
        {
            memcpy(dev_ep3path, cur_dev->path, 1024);
            DEBUG_LOG("device read EP3 data path:%s", dev_ep3path);
            DebugMessage("Find device read EP3 data path...");

        }

        cur_dev = cur_dev->next;
      }
      hid_free_enumeration(devs);

      DEBUG_LOG("open hid read data...");
      device_ep3_info.h_datadevice = hid_open_path(dev_ep3path);

      if(device_ep3_info.h_datadevice != NULL)
      {
        rtn = true;
        DEBUG_LOG("open read data handle success...");
        DebugMessage("open read data handle success...");

        hid_set_nonblocking(device_ep3_info.h_datadevice, 1);
      }
      else
        DebugMessage("open read data handle fails...");


      device_ep3_info.DeviceDataCallback.Reset(isolate,args[2]);
      DEBUG_LOG(" device_ep3_info.DeviceDataCallback.Reset");

      uv_thread_create(&device_ep3_info.thread, HIDReadThreadFn, &device_ep3_info);

      args.GetReturnValue().Set(Integer::New(isolate,rtn));
  } 

  void OpenDeviceHID(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // DebugMessage("hid_init()...");
    if (hid_init()) {
      DebugMessage("ErrorHandler OpenDeviceHID fails...");
      return;
    }

    uint32_t VID = (short)args[0]->Int32Value();
    uint32_t PID = (short)args[1]->Int32Value();

    char msg[256] = {0};
    sprintf(msg, "hid_open vid:%4x, pid:%4x...", VID, PID);
    DebugMessage(msg);
    h_hiddevice = hid_open(VID, PID, NULL);

  }

  void FindDevice(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    uint32_t VID = (short)args[0]->Int32Value();
    uint32_t PID = (short)args[1]->Int32Value();
    bool rtn = false;
    char msg[512] = {0};

    DEBUG_LOG("find device vid:%4d, pid:%4d", VID, PID);

    struct hid_device_info *devs, *cur_dev;
    char dev_path[1024] = {0};
    char dev_path_484[1024] = {0};
    char dev_path1[1024] = {0};

    devs = hid_enumerate(VID, PID);
	  cur_dev = devs;	
    while (cur_dev) {

      DEBUG_LOG("Device Found type: %04hx %04hx  usage_page: %d  usage: %d, interface_number: %d\n", cur_dev->vendor_id, cur_dev->product_id, cur_dev->usage_page, cur_dev->usage, cur_dev->interface_number);
      
      // if(cur_dev->usage_page == 0xFF01 && cur_dev->usage == 1)
      if(cur_dev->usage_page == 0xFF01 && cur_dev->usage == 1)
      {
          memcpy(dev_path, cur_dev->path, 1024);
          DEBUG_LOG("feature path : %s", dev_path);
      }

      // if(cur_dev->usage_page == 0xFF02 && cur_dev->usage == 1)
      // {
      //     memcpy(dev_path_484, cur_dev->path, 1024);
      //     DEBUG_LOG("feature path : %s", dev_path_484);
      // }

      if(cur_dev->usage_page == 0xFFC2 && cur_dev->usage == 4)
      {
          memcpy(dev_path1, cur_dev->path, 1024);
          DEBUG_LOG("out data path : %s", dev_path1);
      }
      
      cur_dev = cur_dev->next;
    }
	  hid_free_enumeration(devs);

    //feature report handle
    DEBUG_LOG("open hid feature report...");
    h_hiddevice = hid_open_path(dev_path);

    if(h_hiddevice != NULL)
    {
      rtn = true;
      DEBUG_LOG("open feature report handle success...");
      DebugMessage("open feature report handle success...");
    }
    else
    {
      DEBUG_LOG("open feature report handle fails...");
      DebugMessage("open feature report handle fails...");
    }


    // //feature report handle
    // DEBUG_LOG("open hid feature report (484 byte)...");
    // h_hiddevice_484 = hid_open_path(dev_path_484);

    // if(h_hiddevice_484 != NULL)
    // {
    //   rtn = true;
    //   DEBUG_LOG("open feature report handle success (484 byte)...");
    //   DebugMessage("open feature report handle success (484 byte)...");
    // }
    // else
    // {
    //   DEBUG_LOG("open feature report handle fails (484 byte)...");
    //   DebugMessage("open feature report handle fails (484 byte)...");
    // }

    //out data handle
    h_out_hiddevice = hid_open_path(dev_path1);

    if(h_out_hiddevice != NULL)
    {
      rtn = true;
      DEBUG_LOG("open out data report handle success...");
      DebugMessage("open out data report handle success...");
    }
    else
    {
      DEBUG_LOG("open out data report handle fails...");
      DebugMessage("open out data report handle fails...");
    }

    args.GetReturnValue().Set(Integer::New(isolate,rtn));
  }


  void SetFeatureReport(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    uint32_t ReportID = args[0]->Uint32Value();
	  uint32_t wLength = args[1]->Uint32Value();

    unsigned char* inBuf = (unsigned char*)node::Buffer::Data(args[2]->ToObject());
    unsigned char data[512] = {0};
    data[0] = ReportID;
    memcpy(data, inBuf, wLength);

    // DEBUG_LOG("Set Featurereport ... data : %x, %x, %x, %x, %x, %x, %x, %x", data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
    int res = 0;
    if(wLength == 64)
    {
      res = hid_send_feature_report(h_hiddevice, data, wLength);
    }
    else if(wLength == 484)
    {
      res = hid_send_feature_report(h_hiddevice_484, data, wLength);
    }

    if (res < 0) {
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate,"Unable to send a feature report.")));
      DEBUG_LOG("Unable to send a feature report...");

      return;
	  }
	  args.GetReturnValue().Set(res);  
  }

  void GetFeatureReport(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    unsigned char data[512] = {0};

    uint32_t ReportID = args[0]->Uint32Value();
	  uint32_t wLength = args[1]->Uint32Value();

    data[0] = ReportID;

    DEBUG_LOG("Get Featurereport ReprotID : %x, Length : %d...", ReportID, wLength);


    int res = hid_get_feature_report(h_hiddevice, data, wLength);
    if (res < 0) {
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate,"Unable to get a feature report.")));
      DEBUG_LOG("Unable to get a feature report....");
      return;
    }

    Local<Object> buf;
    if (ReportID == 0)
    {
      DEBUG_LOG("Unable to get a feature report.... reportID : 0");
      buf = node::Buffer::Copy(isolate, (char *)data, res).ToLocalChecked();
    }
    else
    {
      buf = node::Buffer::Copy(isolate, (char *)(data+1), res-1).ToLocalChecked();
      DEBUG_LOG("Get a feature report.... reportID : data : %x, %x, %x, %x, %x, %x, %x, %x", data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
    }
    args.GetReturnValue().Set(buf);
  }


  void WirteOutputData(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    uint32_t ReportID = args[0]->Uint32Value();
	  uint32_t wLength = args[1]->Uint32Value();

    unsigned char* inBuf = (unsigned char*)node::Buffer::Data(args[2]->ToObject());
    unsigned char data[512] = {0};
    data[0] = ReportID;
    memcpy(data, inBuf, wLength);

    // DEBUG_LOG("Set Featurereport ... data : %x, %x, %x, %x, %x, %x, %x, %x", data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
    int res = 0;
    res = hid_write(h_out_hiddevice, data, wLength);

    if (res < 0) {
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate,"Unable to send a feature report.")));
      DEBUG_LOG("Unable to send a feature report...");

      return;
	  }
	  args.GetReturnValue().Set(res);  
  }

  void ForgroundAppEventCallback(const FunctionCallbackInfo<Value>& args) {  
    Isolate* isolate = args.GetIsolate();

    if(ApplicationRegisteredEvent == NULL)
    {
      ApplicationRegisteredEvent = CreateEvent(NULL, false, false, "");

      uv_work_t* reqAppEvent = new uv_work_t();
      uv_queue_work(uv_default_loop(), reqAppEvent, AppEventAsync, (uv_after_work_cb)AppEventFinished);

      AppEventCallback.Reset(isolate,args[0]);
    }
    
  }

  void RunVirtualKey(const FunctionCallbackInfo<Value>& args) {  
    Isolate* isolate = args.GetIsolate();

    uint32_t ModifyKey = args[0]->Uint32Value();
	  uint32_t VirtualKey = args[1]->Uint32Value();
   

    if(ModifyKey != 0)
    {
      keybd_event(ModifyKey,0,0,0);
      Sleep(10);
      keybd_event(VirtualKey,0,0,0);
      Sleep(30);
      keybd_event(VirtualKey,0,KEYEVENTF_KEYUP,0);
      Sleep(10);
      keybd_event(ModifyKey,0,KEYEVENTF_KEYUP,0);
    }
    else
    {
      keybd_event(VirtualKey,0,0,0);
      Sleep(30);
      keybd_event(VirtualKey,0,KEYEVENTF_KEYUP,0);
    }
  }


//
  // WinProcCallback
  //
  INT_PTR WINAPI WinProcCallback( HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam )
  // Routine Description:
  //     Simple Windows callback for handling messages.
  //     This is where all the work is done because the example
  //     is using a window to process messages. This logic would be handled 
  //     differently if registering a service instead of a window.

  // Parameters:
  //     hWnd - the window handle being registered for events.

  //     message - the message being interpreted.

  //     wParam and lParam - extended information provided to this
  //          callback by the message sender.

  //     For more information regarding these parameters and return value,
  //     see the documentation for WNDCLASSEX and CreateWindowEx.
  {
    LRESULT lRet = 1;
    static HDEVNOTIFY hDeviceNotify;
    static HWND hEditWnd;
    static ULONGLONG msgCount = 0;

    switch (message)
    {
      case WM_DEVICECHANGE:
      {
        //
        // This is the actual message from the interface via Windows messaging.
        // This code includes some additional decoding for this particular device type
        // and some common validation checks.
        //
        // Note that not all devices utilize these optional parameters in the same
        // way. Refer to the extended information for your particular device type 
        // specified by your GUID.
        //
        switch (wParam)
        {
          case DBT_DEVICEARRIVAL:
          {
            PDEV_BROADCAST_HDR pHdr = (PDEV_BROADCAST_HDR)lParam;

            if(pHdr->dbch_devicetype == DBT_DEVTYP_DEVICEINTERFACE) {
              PDEV_BROADCAST_DEVICEINTERFACE info = (PDEV_BROADCAST_DEVICEINTERFACE)pHdr;
              NotifyHidDevicePNP(info, true);
            }                    
            break;
          }
          case DBT_DEVICEREMOVECOMPLETE:
          {
            PDEV_BROADCAST_HDR pHdr = (PDEV_BROADCAST_HDR)lParam;

            if(pHdr->dbch_devicetype == DBT_DEVTYP_DEVICEINTERFACE) {
              PDEV_BROADCAST_DEVICEINTERFACE info = (PDEV_BROADCAST_DEVICEINTERFACE)pHdr;
              NotifyHidDevicePNP(info, false);
            }                    
            break;
          }
        }

        
        // DEBUG_LOG("WinProcCallback --- WM_DEVICECHANGE...");

         
        // MessageCallBack("WinProcCallback --- WM_DEVICECHANGE...");
        
        // uv_work_t* reqDevChg = new uv_work_t();
        // RunHidCallback(reqDevChg);
        
        // OutputMessage(hEditWnd, wParam, (LPARAM)strBuff);
      }
      break;
        
      case WM_INPUT:
      {
        UINT     dwSize;
        LPBYTE   lpb;
        LPRAWINPUT raw;
        int      n=0;

        if(keyDataFlag != 0)
        {
          GetRawInputData((HRAWINPUT)lParam,RID_INPUT,NULL,&dwSize,sizeof(RAWINPUTHEADER));				
          lpb = new BYTE[dwSize];
          if (lpb == NULL) 
          {
            return 0;
          } 
          GetRawInputData((HRAWINPUT)lParam,RID_INPUT,lpb,&dwSize,sizeof(RAWINPUTHEADER)); 
          raw=(RAWINPUT*)lpb;
          
          //RAWINPUT* raw = (RAWINPUT*)lpb;
          if (raw->header.dwType == RIM_TYPEKEYBOARD)
          {

              KEYBOARD_KEYDATA *keyData = new KEYBOARD_KEYDATA;

              if (raw->data.keyboard.Message == WM_KEYDOWN ||
                  raw->data.keyboard.Message == WM_SYSKEYDOWN)
              {
                USHORT usKey;
                USHORT usMake;
                USHORT usFlag;
                usKey = raw->data.keyboard.VKey;
                usMake =raw->data.keyboard.MakeCode;
                usFlag = raw->data.keyboard.Flags;
                // CHAR szTest[4];
                // _itoa_s((int)usKey, szTest, 4, 10);

                // WCHAR str[4];
                // MultiByteToWideChar( 0, 0, szTest, 4, str, 4);

                keyData->vKey = usKey;
                keyData->MakeCode = usMake;
                keyData->Flag = usFlag;
                keyData->keyStatus = 1;


                NotifyKeyData(keyData);

                DEBUG_LOG("keyboard VKey keydown : %x, MakeCode:%x", usKey, usMake);
                // DebugMessage("data.keyboard.Message == WM_KEYDOWN...");
            
              }
              else if (raw->data.keyboard.Message == WM_KEYUP ||
                  raw->data.keyboard.Message == WM_SYSKEYUP)
              {
                USHORT usKey;
                USHORT usMake;
                USHORT usFlag;
                usKey = raw->data.keyboard.VKey;
                usMake =raw->data.keyboard.MakeCode;
                usFlag = raw->data.keyboard.Flags;
                // CHAR szTest[4];
                // _itoa_s((int)usKey, szTest, 4, 10);

                // WCHAR str[4];
                // MultiByteToWideChar( 0, 0, szTest, 4, str, 4);

                keyData->vKey = usKey;
                keyData->MakeCode = usMake;
                keyData->Flag = usFlag;
                keyData->keyStatus = 0;

                NotifyKeyData(keyData);

                DEBUG_LOG("keyboard VKey keyup : %x, MakeCode:%x", usKey, usMake);
              }
          }

          LocalFree(lpb);		
        }

        break;
      }  

      case WM_CLOSE:
        if ( ! UnregisterDeviceNotification(hDeviceNotify) )
        {
          // ErrorHandler(TEXT("UnregisterDeviceNotification")); 
        }
        DestroyWindow(hWnd);
        break;

      case WM_DESTROY:
        PostQuitMessage(0);
      break;

      default:
        // Send all other messages on to the default windows handler.
        // lRet = DefWindowProc(hWnd, message, wParam, lParam);
      break;
    }

    return lRet;
  }

  DWORD WINAPI ListenerThread( LPVOID lpParam ) {
  
    WNDCLASSA window_class;

    window_class .style         = CS_DBLCLKS | CS_PARENTDC;
    window_class .lpfnWndProc   = (WNDPROC)WinProcCallback;
    window_class .cbClsExtra    = 0;
    window_class .cbWndExtra    = 0;
    window_class .hInstance     = GetModuleHandle(0);
    window_class .hIcon         = NULL;
    window_class .hCursor       = NULL;
    window_class .hbrBackground = NULL;
    window_class .lpszMenuName  = NULL;
    window_class .lpszClassName = "Dummy_window";

    RegisterClassA( &window_class );

    hWnd = CreateWindowExA(
        WS_EX_CLIENTEDGE | WS_EX_APPWINDOW | WS_EX_TOPMOST,
        "Dummy_window",
        "Dummy_window",
        0, // style
        0, 0, 
        0, 0,
        NULL, NULL, 
        0, 
        NULL);

    if ( hWnd == NULL )
    {
      // ErrorHandler(TEXT("CreateWindowEx: main appwindow hWnd"));
      DebugMessage("ErrorHandler CreateWindowEx: main appwindow hWnd...");
      return -1;
    }

    _GUID GUID_DEVINTERFACE_USB_DEVICE;

    GUID_DEVINTERFACE_USB_DEVICE.Data1 = 0xA5DCBF10L;
    GUID_DEVINTERFACE_USB_DEVICE.Data2 = 0x6530;
    GUID_DEVINTERFACE_USB_DEVICE.Data3 = 0x11D2;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[0] = 0x90;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[1] = 0x1F;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[2] = 0x00;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[3] = 0xC0;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[4] = 0x4F;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[5] = 0xB9;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[6] = 0x51;
    GUID_DEVINTERFACE_USB_DEVICE.Data4[7] = 0xED;
  
    DEV_BROADCAST_DEVICEINTERFACE_A notifyFilter = { 0 };

    ZeroMemory(&notifyFilter, sizeof(notifyFilter));
    notifyFilter.dbcc_size = sizeof(notifyFilter);
    notifyFilter.dbcc_devicetype = DBT_DEVTYP_DEVICEINTERFACE;
    notifyFilter.dbcc_classguid = GUID_DEVINTERFACE_USB_DEVICE;

    HDEVNOTIFY hDevNotify =
        RegisterDeviceNotificationA(hWnd, &notifyFilter,
        // DEVICE_NOTIFY_ALL_INTERFACE_CLASSES |
        DEVICE_NOTIFY_WINDOW_HANDLE);


    if ( !hDevNotify ) 
    {
        // ErrorHandler(TEXT("RegisterDeviceNotification"));
        DebugMessage("ErrorHandler RegisterDeviceNotification...");
        return FALSE;
    }

    HWINEVENTHOOK appHook = SetWinEventHook(EVENT_MIN, EVENT_MAX , NULL, HandleAppEvent, 0, 0, 
                                                WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);


    MSG msg;
    while(TRUE) {
      BOOL bRet = GetMessage(&msg, hWnd, 0, 0);
      if ((bRet == 0) || (bRet == -1)) {
        break;
      }

      TranslateMessage(&msg);
      DispatchMessage(&msg);
    }
    
    WTSUnRegisterSessionNotification(hWnd);
    UnhookWinEvent(appHook);

    return 0;
  }

  void GetHidDeviceList(const FunctionCallbackInfo<Value>& args) {

    Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "GetHidDeviceList"));
  }


  void RegisterHid() {


    devicePNPEvent = CreateEvent(NULL, false , true , "");

    //Create thread
    hid_thread = CreateThread(NULL, 0, ListenerThread, NULL, 0, &threadId);

    

    // uv_work_t* req = new uv_work_t();
	  // uv_queue_work(uv_default_loop(), req, NotifyAsync, (uv_after_work_cb)NotifyFinished);
  
  } 

  // int InitHidFunctions()
  // {
  //   lib_handle = LoadLibraryA("hid.dll");
  //   if (lib_handle) {
  // #define RESOLVE(x) x = (x##_)GetProcAddress(lib_handle, #x); if (!x) return -1;
  //     RESOLVE(HidD_GetAttributes);
  //     RESOLVE(HidD_GetSerialNumberString);
  //     RESOLVE(HidD_GetManufacturerString);
  //     RESOLVE(HidD_GetProductString);
  //     RESOLVE(HidD_SetFeature);
  //     RESOLVE(HidD_GetFeature);
  //     RESOLVE(HidD_GetIndexedString);
  //     RESOLVE(HidD_GetPreparsedData);
  //     RESOLVE(HidD_FreePreparsedData);
  //     RESOLVE(HidP_GetCaps);
  //     RESOLVE(HidD_SetNumInputBuffers);
  //     RESOLVE(HidD_GetHidGuid);
  // #undef RESOLVE
  //   }
  //   else
  //     return -1;
  
  //   return 0;
  // }

  // int FreeHidFunctions()
  // {
  //     if (lib_handle)
  //       FreeLibrary(lib_handle);
  //     lib_handle = NULL;
  //     return 1;
  // }

  void StartHidPnpNotify(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    RegisterHid();
    DebugMessage("StartHidPnpNotify...");
  }
  
  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "StartHidPnpNotify", StartHidPnpNotify);
    NODE_SET_METHOD(exports, "DebugMessageCallback", RunDebugCallback);
    NODE_SET_METHOD(exports, "HIDPnpCallBack", RunHidCallback);
    NODE_SET_METHOD(exports, "OpenDeviceHID", OpenDeviceHID);
    NODE_SET_METHOD(exports, "FindDevice", FindDevice);
    NODE_SET_METHOD(exports, "SetFeatureReport", SetFeatureReport);
    NODE_SET_METHOD(exports, "GetFeatureReport", GetFeatureReport);
    NODE_SET_METHOD(exports, "DeviceDataCallback", RunDeviceDataCallback);
    NODE_SET_METHOD(exports, "KeyboardDataCallback", RunKeyboardDataCallback);
    NODE_SET_METHOD(exports, "WirteOutputData", WirteOutputData);
    NODE_SET_METHOD(exports, "ForgroundAppEvent", ForgroundAppEventCallback);
    NODE_SET_METHOD(exports, "RunVirtualKey", RunVirtualKey);
  }
  
  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
  
}  // namespace demo