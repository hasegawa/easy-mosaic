import cv2
import numpy

# imageを拡大縮小する関数
def scalling(image: numpy.ndarray, ratio) -> numpy.ndarray:
    return cv2.resize(image, None, None, ratio, ratio, cv2.INTER_NEAREST)

# imageの一部にscalling関数を適用する
def mosaic_image(origin_image: numpy.ndarray, x:int, y:int, width:int, height:int):
    image = origin_image.copy()
    roi = image[y:y + height, x:x + width] # (y軸, x軸)の順。ROIはRegion Of Interest
    roi = scalling(scalling(roi, 0.1),10) # 0.1倍縮小程度がちょうどよさそう
    image[y:y + height, x:x + width] = roi
    return image