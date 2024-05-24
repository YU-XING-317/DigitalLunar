from osgeo import gdal

dataset = gdal.Open('D:\\TIF\\LU1319373_Wang&Wu_2021\\R-Value Maps\\2.5-3.5.tif',gdal.GA_Update)
ds = gdal.Open("D:\TIF\globalDEM_WGS84.tif", gdal.GA_ReadOnly)
#获取宽高
width = dataset.RasterXSize
height = dataset.RasterYSize
# print("宽：{}，高：{}".format(width ,height))
# a = (-180.0, 360.0/width, 0.0, 90.0, 0.0, -180.0/height)
transform = dataset.GetGeoTransform()

tf=ds.GetGeoTransform()
print(f"原文件Transfrom属性：\n{transform}")
print()
print(f"参考文件Transfrom属性：\n{tf}")
#dataset.SetGeoTransform(a)
dataset.SetProjection(ds.GetProjection())
print(f"Transfrom属性：\n{transform}")
print(f"Projection属性：\n{dataset.GetProjection()}")



