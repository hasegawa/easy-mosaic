from fastapi import FastAPI
from pydantic import BaseModel
from image import base64_to_ndarray, mosaic_image, ndarray_to_base64

app = FastAPI()

class filterParametars(BaseModel):
    base64_str: str
    start_x_position: int
    start_y_position: int
    width: int
    height: int

@app.post("/api/v1/filter/mosaic")
async def mosaic_fileter(param: filterParametars):
    image_ndarray = base64_to_ndarray(param.base64_str)
    modified_image = mosaic_image(image_ndarray, param.start_x_position ,param.start_y_position ,param.width,param.height)
    base64_str = ndarray_to_base64(modified_image)
    return {"image_base64": base64_str}