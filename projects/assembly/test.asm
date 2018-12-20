MOV A, 'a'
CALL printc
MOV a, '#'
CALL printc
HLT

output: DB 232

printc: ; output char
  PUSH D ; save D
  MOV D, [output]
  MOV [D], A ; output the char
    
  INC D
  MOV [output], D

  POP D ; restore D
  RET