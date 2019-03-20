import cv2
from os import listdir
from os.path import isfile, join
import json

imgWidth = 20
imgHeight = 16

outputs = listdir('output')

for item in listdir('input'):
	if (not item in outputs and isfile(join('input', item))):
		img = cv2.resize(cv2.imread('input/' + item, 0), (imgWidth, imgHeight)) 
		arr = []
		for row in range(len(img)):
			arr.append([])
			for pixel in range(len(img[row])):
				if img[row][pixel] < 128:
					arr[row].append(0)
					img[row][pixel] = 0
				else:
					arr[row].append(255)
					img[row][pixel] = 255
		f = open('output/'+item+'.json', 'w+')
		f.write(json.dumps(arr))
		f.close()
		cv2.imwrite('output/' + item, img)