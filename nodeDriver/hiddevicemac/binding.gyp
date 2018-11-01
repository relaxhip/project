{
      'variables': {
            'driver%': 'hidraw'
      },
      'targets': [
            {
                  'target_name': 'hiddevicemac',
                  'include_dirs+': [
                        'src/',
                  ],
                  'sources': [ 'src/hiddevice.cc', "src/hiddevice.h"],
                  'defines':[
                        'DEBUG'
                  ],
                  'dependencies': ['hidapi'],
                  'ldflags': [
                        '-framework',
                        'IOKit',
                        '-framework',
                        'CoreFoundation'
                  ],
                  'xcode_settings': {
                        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                  },
                  'link_settings':{
                        'libraries':[
                        '-framework',
                        'IOKit',
                        '$(SDKROOT)/System/Library/Frameworks/Security.framework',
                        ]
                  }
            },
            {
                  'target_name': 'hidapi',
                  'type': 'static_library',
                  'conditions': [
                  [ 'OS=="mac"', {
                  'sources': [ '../thridparty/hidapi/mac/hid.c' ],
                  'include_dirs+': [
                        '/usr/include/libusb-1.0/'
                  ]
                  }],
                  [ 'OS=="linux"', {
                  'conditions': [
                        [ 'driver=="libusb"', {
                        'sources': [ '../thridparty/hidapi/libusb/hid.c' ],
                        'include_dirs+': [
                        '/usr/include/libusb-1.0/'
                        ]
                        }],
                        [ 'driver=="hidraw"', {
                        'sources': [ '../thridparty/hidapi/linux/hid.c' ]
                        }]
                  ]
                  }],
                  [ 'OS=="win"', {
                  'sources': [ '../thridparty/hidapi/windows/hid.c' ],
                  'msvs_settings': {
                        'VCLinkerTool': {
                        'AdditionalDependencies': [
                        'setupapi.lib',
                        ]
                        }
                  }
                  }]
                  ],
                  'direct_dependent_settings': {
                  'include_dirs': [
                  '../thridparty/hidapi/hidapi'
                  ]
                  },
                  'include_dirs': [
                  '../thridparty/hidapi/hidapi'
                  ],
                  'defines': [
                  '_LARGEFILE_SOURCE',
                  '_FILE_OFFSET_BITS=64',
                  ],
                  'cflags': ['-g'],
                  'cflags!': [
                  '-ansi'
                  ]
            }
      ]
}
