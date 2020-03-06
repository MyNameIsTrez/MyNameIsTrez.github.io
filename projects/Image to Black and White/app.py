import cv2
from os import listdir
from os.path import isfile, join
import json

imgWidth = 128
imgHeight = 128

maxValueBlack = 128 # every value below this will get turned black, if invert = False
invert = False # inverts the black and white

for item in listdir('input'):
	# if (not item in listdir('output-image')): # if the file doesn't already exist
		if isfile(join('input', item)):
			# read the file, convert it to black and white, resize the image
			img = cv2.resize(cv2.imread('input/' + item, 0), (imgWidth, imgHeight)) 
			arr = []
			for row in range(len(img)):
				arr.append([])
				for pixel in range(len(img[row])):
					if img[row][pixel] < maxValueBlack:
						if not invert:
							arr[row].append(True)
							img[row][pixel] = 0
						else:
							arr[row].append(False)
							img[row][pixel] = 255
					else:
						if not invert:
							arr[row].append(False)
							img[row][pixel] = 255
						else:
							arr[row].append(True)
							img[row][pixel] = 0
			f = open('output-json/'+item+'.json', 'w+')
			f.write(json.dumps(arr))
			f.close()
			cv2.imwrite('output-img/' + item, img)