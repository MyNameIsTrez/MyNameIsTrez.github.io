#include <cstdlib>

#define CIRCLE_RADIUS 10000
#define AREA_WIDTH 10000
#define AREA_HEIGHT 10000
#define AREA_SIZE (AREA_WIDTH * AREA_HEIGHT)

// clear && c++ swap_remove.cpp -Wall -Wextra -Werror -Wpedantic -Wshadow -Wfatal-errors -g -fsanitize=address,undefined -O3 && time ./a.out
int main() {
	int *v2i = new int[AREA_SIZE]; // value-to-index
	int *i2v = new int[AREA_SIZE]; // index-to-value
	for (int i = 0; i < AREA_SIZE; i++) {
		v2i[i] = i;
		i2v[i] = i;
	}

	int open = AREA_SIZE;

	while (open > 0) {
		int ci = rand() % open; // Center index
		int cv = i2v[ci]; // Center value

		int x = cv % AREA_WIDTH;
		int y = cv / AREA_WIDTH;

		for (int dx = -CIRCLE_RADIUS; dx <= CIRCLE_RADIUS; dx++) {
			for (int dy = -CIRCLE_RADIUS; dy <= CIRCLE_RADIUS; dy++) {
				int nx = x + dx; // Neighbor x
				int ny = y + dy;
				if (nx < 0 || nx >= AREA_WIDTH || ny < 0 || ny >= AREA_HEIGHT) {
					continue;
				}

				int nv = nx + ny * AREA_WIDTH;
				int ni = v2i[nv];

				// TODO: Check whether removing this check is faster
				if (ni < open) {
					// TODO: Visualize ni by printing it in a board
					open--;

					int from_i = ni;
					int to_i = open;

					int from_v = nv;
					int to_v = i2v[open];

					v2i[from_v] = to_i;
					i2v[to_i] = from_v;

					v2i[to_v] = from_i;
					i2v[from_i] = to_v;
				}
			}
		}
	}

	delete[] v2i;
	delete[] i2v;
}
