from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("app")

async def value_error_handler(request: Request, exc: ValueError):
    """
    Catches business logic ValueErrors and returns a 400 Bad Request.
    """
    logger.warning(f"Validation Error: {str(exc)} at {request.url}")
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catches all other unhandled exceptions and returns a 500 Internal Server Error.
    """
    logger.error(f"Internal Server Error: {str(exc)} at {request.url}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal error occurred."},
    )
