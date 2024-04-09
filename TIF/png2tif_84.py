import os
import sys
from osgeo import gdal

def png_to_tif(png_file, tif_file):
    input_dataset = gdal.Open(png_file)
    output_driver = gdal.GetDriverByName('GTiff')
    output_dataset = output_driver.CreateCopy(tif_file, input_dataset)
    input_dataset = None
    output_dataset = None

def set_geotransform(tif_file, new_tif_file):
    input_dataset = gdal.Open(tif_file)
    output_dataset = gdal.Open(new_tif_file, gdal.GA_Update)
    output_dataset.SetGeoTransform(input_dataset.GetGeoTransform())
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
