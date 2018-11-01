#include <stdlib.h>
#include <stdio.h>
#include <node.h>
#include <v8.h>
#include <node_buffer.h>

#include <CoreFoundation/CoreFoundation.h>

#include <IOKit/IOKitLib.h>
#include <IOKit/IOMessage.h>
#include <IOKit/IOCFPlugIn.h>
#include <IOKit/usb/IOUSBLib.h>

#include <Carbon/Carbon.h>
#include <ApplicationServices/ApplicationServices.h>

#include <stdint.h>
#include <vector>

#include <IOKit/hidsystem/IOHIDLib.h>
#include <IOKit/hidsystem/IOHIDParameter.h>
#include <IOKit/hidsystem/event_status_driver.h>

#include <pthread.h>
#include <uv.h>

#include <hidapi.h>


using namespace v8;

#define DEBUG_HEADER fprintf(stderr, "hiddevice [%s:%s() %d]: ", __FILE__, __FUNCTION__, __LINE__); 
#define DEBUG_FOOTER fprintf(stderr, "\n");
#define DEBUG_LOG(...) DEBUG_HEADER fprintf(stderr, __VA_ARGS__); DEBUG_FOOTER

void NotifyAsync(uv_work_t* req);
void NotifyFinished(uv_work_t* req);


void CallbackAsync(uv_work_t* req);
void CallbackFinished(uv_work_t* req);

Persistent<Value> HIDPNPCallback;
Persistent<Value> DebugMessageCallback;



//thread
static pthread_t DevicePNPThread;

static IONotificationPortRef    gNotifyPort;
static io_iterator_t            gAddedIter;
static CFRunLoopRef             gRunLoop;

CFMutableDictionaryRef          matchingDict;
CFRunLoopSourceRef              runLoopSource;

typedef struct DeviceListItem 
{
    io_object_t             notification;
    IOUSBDeviceInterface**  deviceInterface;
    UInt16                  vendorId;
    UInt16                  productId;

} stDeviceListItem;

typedef struct DeviceAttributes 
{
	UInt16 VendorID;
	UInt16 ProductID;
	UInt16 Location;
	bool Status;
} stDeviceAttributes;


//hidapi
hid_device* h_hiddevice;
hid_device *connected_device;


namespace hiddevicemac {
  
  using v8::Function;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Null;
  using v8::Object;
  using v8::String;
  using v8::Value;




  void HidCallback(stDeviceAttributes *deviceInfo)
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

  void MessageCallBack(char * message)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    Handle<Value> argv[1] = { String::NewFromUtf8(isolate, message) };
    
    Local<Value> cbVal=Local<Value>::New(isolate, DebugMessageCallback);
    Local<Function> cb = Local<Function>::Cast(cbVal);
    cb->Call(isolate->GetCurrentContext()->Global(), 1, argv);

  }

  void CallbackAsync(uv_work_t* req) {
  }

  void CallbackFinished(uv_work_t* req) {

    char * msg = static_cast<char *>(req->data);
    MessageCallBack(msg);
  }

  void DebugMessage(char * msg)
  {
    uv_work_t* req = new uv_work_t();
    req->data = msg;
    uv_queue_work(uv_default_loop(), req, CallbackAsync, (uv_after_work_cb)CallbackFinished);

  }

  void NotifyAsync(uv_work_t* req) {
  }

  void NotifyFinished(uv_work_t* req) {

    stDeviceAttributes *device = (stDeviceAttributes*)req->data;

    HidCallback(device);
  }
  
  void NotifyHidDevicePNP(UInt16 vid, UInt16 pid, bool status)
  {
    stDeviceAttributes *device = new stDeviceAttributes();

    device->VendorID = vid;
    device->ProductID = pid;
    device->Status = status;

    uv_work_t* req = new uv_work_t();
    req->data = device;
    uv_queue_work(uv_default_loop(), req, NotifyAsync, (uv_after_work_cb)NotifyFinished);
  }

  void RunDebugCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    DebugMessageCallback.Reset(isolate, args[0]);
  } 

  void RunHidCallback(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    HIDPNPCallback.Reset(isolate,args[0]);
  }

  void OpenDeviceHID(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // DebugMessage("hid_init()...");
    // if (hid_init()) {
    //   DebugMessage("ErrorHandler OpenDeviceHID fails...");
    //   return;
    // }

    UInt16 VID = (short)args[0]->Int32Value();
    UInt16 PID = (short)args[1]->Int32Value();

    char msg[256] = {0};
    // printf(msg, "hid_open(vid:, pid:)...");
    DebugMessage(msg);
    // h_hiddevice = hid_open(VID, PID, NULL);

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

    devs = hid_enumerate(VID, PID);
	  cur_dev = devs;	
    while (cur_dev) {

      DEBUG_LOG("Device Found type: %04hx %04hx  usage_page: %d  usage: %d\n", cur_dev->vendor_id, cur_dev->product_id, cur_dev->usage_page, cur_dev->usage);
      
      if(cur_dev->usage_page == 1 && cur_dev->usage == 2)
      {
          memcpy(dev_path, cur_dev->path, 1024);
          DEBUG_LOG(dev_path);
      }
      
      cur_dev = cur_dev->next;
    }
	  hid_free_enumeration(devs);

    DEBUG_LOG("open hid feature report...");
    h_hiddevice = hid_open_path(dev_path);

    if(h_hiddevice != NULL)
    {
      rtn = true;
      DEBUG_LOG("open feature report handle success...");
    }
    args.GetReturnValue().Set(Integer::New(isolate,rtn));
  }

  void SetFeatureReport(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    uint32_t ReportID = args[0]->Uint32Value();
	  uint32_t wLength = args[1]->Uint32Value();

    unsigned char* inBuf = (unsigned char*)node::Buffer::Data(args[2]->ToObject());
    unsigned char data[64] = {0};
    data[0] = ReportID;
    memcpy(data, inBuf, wLength);

    DEBUG_LOG("Set Featurereport ... data : %x, %x, %x, %x, %x, %x, %x, %x", data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
    int res = 0;
    res = hid_send_feature_report(h_hiddevice, data, wLength);

    if (res < 0) {
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate,"Unable to send a feature report.")));
      DEBUG_LOG("Unable to send a feature report...");

      return;
	  }
	  args.GetReturnValue().Set(res);  
  }

  void GetFeatureReport(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    unsigned char data[64] = {0};

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



  void DeviceRemoved(void *refCon, io_service_t service, natural_t messageType, void *messageArgument)
  {
    kern_return_t   kr;
      stDeviceListItem* deviceListItem = (stDeviceListItem *) refCon;

      if (messageType == kIOMessageServiceIsTerminated) 
      {
          if (deviceListItem->deviceInterface) 
          {
              kr = (*deviceListItem->deviceInterface)->Release(deviceListItem->deviceInterface);
          }
          
          kr = IOObjectRelease(deviceListItem->notification);
          
          NotifyHidDevicePNP(deviceListItem->vendorId, deviceListItem->productId, 0);
      }
  }

  void DeviceAdded(void *refCon, io_iterator_t iterator)
  {
      kern_return_t       kr;
      io_service_t        usbDevice;
      IOCFPlugInInterface **plugInInterface = NULL;
      SInt32              score;
      HRESULT             res;
      
      while ((usbDevice = IOIteratorNext(iterator))) 
      {
          UInt16              vendorId;
          UInt16              productId;

          kr = IOCreatePlugInInterfaceForService(usbDevice, kIOUSBDeviceUserClientTypeID, kIOCFPlugInInterfaceID, &plugInInterface, &score);

          if ((kIOReturnSuccess != kr) || !plugInInterface) 
          {
              fprintf(stderr, "IOCreatePlugInInterfaceForService returned 0x%08x.\n", kr);
              continue;
          }

          stDeviceListItem *deviceListItem = new stDeviceListItem();

          // Use the plugin interface to retrieve the device interface.
          res = (*plugInInterface)->QueryInterface(plugInInterface, CFUUIDGetUUIDBytes(kIOUSBDeviceInterfaceID), (LPVOID*) &deviceListItem->deviceInterface);
          
          // Now done with the plugin interface.
          (*plugInInterface)->Release(plugInInterface);
                      
          if (res || deviceListItem->deviceInterface == NULL) 
          {
              fprintf(stderr, "QueryInterface returned %d.\n", (int) res);
              continue;
          }

          kr = (*deviceListItem->deviceInterface)->GetDeviceVendor(deviceListItem->deviceInterface, &vendorId);
          if (KERN_SUCCESS != kr) 
          {
              fprintf(stderr, "GetDeviceVendor returned 0x%08x.\n", kr);
              continue;
          }

          deviceListItem->vendorId = vendorId;
          // DeviceChangeVID = vendorId;
          
          kr = (*deviceListItem->deviceInterface)->GetDeviceProduct(deviceListItem->deviceInterface, &productId);
          if (KERN_SUCCESS != kr) 
          {
              fprintf(stderr, "GetDeviceProduct returned 0x%08x.\n", kr);
              continue;
          }
          deviceListItem->productId = productId;
          // DeviceChangePID = productId;


          // DeviceChangeType = 1;
          // SendDeviceChangeCallback();
          NotifyHidDevicePNP(vendorId, productId, 1);

          DEBUG_LOG("DeviceAdded... vid:%4d, pid:%4d", vendorId, productId);




          // Register for an interest notification of this device being removed. Use a reference to our
          // private data as the refCon which will be passed to the notification callback.
          kr = IOServiceAddInterestNotification(gNotifyPort,                      // notifyPort
                                                usbDevice,                        // service
                                                kIOGeneralInterest,               // interestType
                                                DeviceRemoved,                 // callback
                                                deviceListItem,                   // refCon
                                                &(deviceListItem->notification)   // notification
                                                );
                                                  
          if (KERN_SUCCESS != kr) 
          {
              printf("IOServiceAddInterestNotification returned 0x%08x.\n", kr);
          }
          
          // Done with this USB device; release the reference added by IOIteratorNext
          kr = IOObjectRelease(usbDevice);
      }
  }

  void *RunUSBDevicePnp(void * arg)
  {
      runLoopSource = IONotificationPortGetRunLoopSource(gNotifyPort);
      
      gRunLoop = CFRunLoopGetCurrent();
      CFRunLoopAddSource(gRunLoop, runLoopSource, kCFRunLoopDefaultMode);      

      CFRunLoopRun();

      fprintf(stderr, "Unexpectedly back from CFRunLoopRun()!\n");
      return NULL;
  }


  void StartHidPnpNotify(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    DEBUG_LOG("StartHidPnpNotify...");

    if (hid_init()) {
      DebugMessage("ErrorHandler OpenDeviceHID fails...");
      return;
    }

    kern_return_t           kr;
    matchingDict = IOServiceMatching(kIOUSBDeviceClassName); 
    if (matchingDict == NULL) 
    {
        fprintf(stderr, "IOServiceMatching returned NULL.\n");
        return;
    }
    gNotifyPort = IONotificationPortCreate(kIOMasterPortDefault);
    kr = IOServiceAddMatchingNotification(gNotifyPort,                  // notifyPort
                                          kIOFirstMatchNotification,    // notificationType
                                          matchingDict,                 // matching
                                          DeviceAdded,              // callback
                                          NULL,                         // refCon
                                          &gAddedIter                   // notification
                                          );        
    
    if (KERN_SUCCESS != kr) 
    {
        printf("IOServiceAddMatchingNotification returned 0x%08x.\n", kr);
        return;
    }

    DeviceAdded(NULL, gAddedIter);

    int rc = pthread_create(&DevicePNPThread, NULL, RunUSBDevicePnp, NULL);
    if (rc)
    {
         printf("ERROR; return code from pthread_create() is %d\n", rc);
         exit(-1);
    }
  }



  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "StartHidPnpNotify", StartHidPnpNotify);
    NODE_SET_METHOD(exports, "DebugMessageCallback", RunDebugCallback);
    NODE_SET_METHOD(exports, "HIDPnpCallBack", RunHidCallback);
    NODE_SET_METHOD(exports, "OpenDeviceHID", OpenDeviceHID);
    NODE_SET_METHOD(exports, "FindDevice", FindDevice);
    NODE_SET_METHOD(exports, "SetFeatureReport", SetFeatureReport);
    NODE_SET_METHOD(exports, "GetFeatureReport", GetFeatureReport);
  }
  
  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
  
}  // namespace demo

