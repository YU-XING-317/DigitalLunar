from osgeo import gdal
import cv2

dataset = gdal.Open('globalDEM.tif', gdal.GA_ReadOnly)
projection = dataset.GetProjection()
print(projection)