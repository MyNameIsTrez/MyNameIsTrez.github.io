#include <assert.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int reaped = 0;

void sigchld_handler(int signum)
{
    (void)signum;

    int wstatus;
    wait(&wstatus);

    reaped++;
}

// cc -Wall -Wextra -Werror naive.c && ./a.out
int main(void)
{
    signal(SIGCHLD, sigchld_handler);

    int forks = 0;
    for (int i = 0; i < 1000; i++)
    {
        pid_t pid = fork();
        assert(pid != -1);
        if (pid == 0)
        {
            // Child process
            return EXIT_SUCCESS;
        }
        // Parent process
        forks++;
    }

    for (int i = 0; i < 1e9; i++)
        ;

    printf("%d out of %d forks were reaped\n", reaped, forks);

    return EXIT_SUCCESS;
}
