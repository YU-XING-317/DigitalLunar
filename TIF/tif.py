from osgeo import gdal
import cv2

dataset = gdal.Open('D:\TIF\globalDEM.tif', gdal.GA_ReadOnly)
projection = dataset.GetProjection()
print(projection)