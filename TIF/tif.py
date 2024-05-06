from osgeo import gdal
import cv2

dataset = gdal.Open(r'D:\School\DigitalLunar\TIF\origin.tif', gdal.GA_ReadOnly)
print("Projection is {}".format(dataset.GetProjection()))