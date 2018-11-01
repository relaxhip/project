set copyfilename=Setup.exe
IF EXIST %copyfilename% (goto SRENAME) ELSE (goto SEND)

:SRENAME
set copyfilename2=BK700_Setup_Beta_
set nameofdate=%date:~2,2%%date:~5,2%%date:~8,2%
set nameoftime=%time:~0,2%%time:~3,2%%time:~6,2%
copy "%copyfilename%" "%nameofdate%_%copyfilename2%%nameoftime%.exe" /y

set nameofall=%nameofdate%_%copyfilename2%%nameoftime%.exe
set nameof7z=%nameofdate%_%copyfilename2%%nameoftime%.7z
7z\7z.exe a -y "%nameof7z%" "%nameofall%"

:SEND

del "%copyfilename%" /f /q

exit