This is AT&T syntax, known due to the use of % everywhere,
so read this in “mov src, dst” order:


pushq %rbp       ; Save address of previous stack frame
movq  %rsp, %rbp ; Address of current stack frame
subq  $2, %rsp   ; Reserve 2 bytes for local variables

; do function stuff here

movq  %rbp, %rsp
popq  %rbp
ret


Say the program’s stack addresses go from 0 to 7:
If the current stack frame rsp is address 5
and the previous stack frame rbp is address 7:

7 rbp at start
6
5 rsp at start, rbp in function
4
3 rsp in function
2
1
0

“pushq %rbp”:
stack.push(rbp); // rbp == 7

“movq %rsp, %rbp”:
rbp = rsp; // rbp = 5

“subq $2, %rsp”:
rsp -= 2; // rsp = 3

// do function stuff here

“movq %rbp, %rsp”:
rsp = rbp; // rsp = 5

“popq  %rbp”:
rbp = stack.pop() // rbp = 7


Notice how rsp and rbp are back to their original values!

- rbp stores the address of the beginning of the stack frame
- rsp stores the address of the end of the stack frame
