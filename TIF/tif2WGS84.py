from osgeo import gdal

dataset = gdal.Open('D:\School\DigitalLunar\TIF\origin.tif',gdal.GA_Update)
ds = gdal.Open("D:\TIF\globalDEM_WGS84.tif", gdal.GA_ReadOnly)
#获取宽高
width = dataset.RasterXSize
height = dataset.RasterYSize
print("宽：{}，高：{}".format(width ,height))
a = (-180.0, 360.0/width, 0.0, 90.0, 180.0/height)
print(a)
transform = dataset.GetGeoTransform()
print(f"原文件Transfrom属性：\n{transform}")
dataset.SetGeoTransform(a)
dataset.SetProjection(ds.GetProjection())


