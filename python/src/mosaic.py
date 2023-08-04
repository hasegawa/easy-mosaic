import cv2
import numpy

def scalling(image: numpy.ndarray, ratio) -> numpy.ndarray:
    return cv2.resize(image, None, None, ratio, ratio, cv2.INTER_NEAREST)
