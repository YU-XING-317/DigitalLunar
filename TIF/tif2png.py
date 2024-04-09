from osgeo import gdal
from PIL import  Image
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None
import cv2

def tifToPngOriginalPixel(file_path):
    file_path = r"globalDEM.tif"
    ds = gdal.Open(file_path)
    driver = gdal.GetDriverByName('PNG')
    dst_ds = driver.CreateCopy(r'globalDEM.png', ds)
    print("png got")

def img_resize(img_path):
    
    img = Image.open(img_path)
    out = img.resize((46080, 23040),Image.LANCZOS)
    out.save(r"globalDEM_resized.png", 'png')
    # img = cv2.imread(img_path)
    # new_height, new_width = 46080, 23040  # 新的高度和宽度
    # resized_img = cv2.resize(img, (new_width, new_height))
    # cv2.imshow('Resized Image', resized_img)
    # print('resized')
    

if __name__ == '__main__':
    tifToPngOriginalPixel('globalDEM.tif')
    #img_resize(r'globalDEM.png')