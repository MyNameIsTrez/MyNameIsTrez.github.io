1. `t_data` mega-struct
2. Using `static` to zero-initialize `t_data`, rather than including and calling `ft_bzero()` on it
3. You'll finally get pointers if you create a C file and play around with pointers and pointer operators for a few hours
4. Make your own vector
5. Use the vector to make a very basic arena allocator, enabling one to not have to have free()ing code, apart from at the very end of your main(). It also allows one to add a description to each allocation, so one can print all descriptions later to see where memory is being used: https://mastodon.gamedev.place/@mynameistrez/110040999600341961
6. Instead of using globals, you can make a function that holds a static variable, and returns a pointer to it.
