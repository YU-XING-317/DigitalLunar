import os
import sys
from osgeo import gdal

def png_to_tif(png_file, tif_file):
    #打开影像数据
    input_dataset = gdal.Open(png_file)
    #创建输出的数据驱动
    output_driver = gdal.GetDriverByName('GTiff')
    #设置输出参数
    output_dataset = output_driver.CreateCopy(tif_file, input_dataset)
    #关闭数据集
    input_dataset = None
    output_dataset = None

def set_geotransform(tif_file, new_tif_file):
    #打开提供坐标参考的影像数据
    input_dataset = gdal.Open(tif_file)
    #打开需要赋予影像数据
    output_dataset = gdal.Open(new_tif_file, gdal.GA_Update)
    #更新输出文件的地理变换信息
    output_dataset.SetGeoTransform(input_dataset.GetGeoTransform())
    #更新输出文件的地理参考系统信息
    output_dataset.SetProjection(input_dataset.GetProjection())
    input_dataset = None
    output_dataset = None

if __name__ == '__main__':
    png_file = "MoonDom_resized.png"
    tif_file = "LRO_LOLA.tif"
    new_tif_file = os.path.splitext(png_file)[0] + "_new.tif"
    png_to_tif(png_file, new_tif_file)
    set_geotransform(tif_file, new_tif_file)
    print("Over")
