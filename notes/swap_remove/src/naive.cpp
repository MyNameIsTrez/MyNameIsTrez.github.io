#include <cstdlib>

#define CIRCLE_RADIUS 10000
#define AREA_WIDTH 10000
#define AREA_HEIGHT 10000
#define AREA_SIZE (AREA_WIDTH * AREA_HEIGHT)

// clear && c++ naive.cpp -Wall -Wextra -Werror -Wpedantic -Wshadow -Wfatal-errors -g -fsanitize=address,undefined -O3 && time ./a.out
int main() {
	bool *area = new bool[AREA_SIZE] {};

	int open = AREA_SIZE;

	while (open > 0) {
		int ci = rand() % AREA_SIZE; // Center index

		int x = ci % AREA_WIDTH;
		int y = ci / AREA_WIDTH;

		for (int dx = -CIRCLE_RADIUS; dx <= CIRCLE_RADIUS; dx++) { // Difference x
			for (int dy = -CIRCLE_RADIUS; dy <= CIRCLE_RADIUS; dy++) {
				int nx = x + dx; // Neighbor x
				int ny = y + dy;
				if (nx < 0 || nx >= AREA_WIDTH || ny < 0 || ny >= AREA_HEIGHT) {
					continue;
				}

				int ni = nx + ny * AREA_WIDTH;

				if (!area[ni]) {
					area[ni] = true;
					open--;
				}
			}
		}
	}

	delete[] area;
}
