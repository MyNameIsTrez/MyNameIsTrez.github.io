MOV A, 'a' ; A = 97
CALL print

MOV A, '#' ; A = 35
CALL print

HLT ; stop

outputIndex: DB 232 ; label 'outputIndex' = 232 at index 11



print:
  PUSH D ; save D = 0 at SP 230

  ; read value of outputIndex and place the character at that index
  MOV D, [outputIndex] ; D = [11] = 232
  MOV [D], A ; [232] = 97

  ; increase the outputIndex value by 1
  INC D ; D++
  MOV [outputIndex], D ; [11] = 233

  POP D ; load SP 230
  RET