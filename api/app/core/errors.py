from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("app")

class AppException(Exception):
    """Base class for all app-specific exceptions."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=status.HTTP_404_NOT_FOUND)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message, status_code=status.HTTP_401_UNAUTHORIZED)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden access"):
        super().__init__(message, status_code=status.HTTP_403_FORBIDDEN)

class ValidationException(AppException):
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, status_code=status.HTTP_400_BAD_REQUEST)

async def app_exception_handler(request: Request, exc: AppException):
    """Handles all custom AppException subclasses."""
    logger.warning(f"App Error: {exc.message} at {request.url} [Status {exc.status_code}]")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "error_type": exc.__class__.__name__
        },
    )

async def value_error_handler(request: Request, exc: ValueError):
    """Catches standard Python ValueErrors and returns a 400."""
    logger.warning(f"Value Error: {str(exc)} at {request.url}")
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "error_type": "ValueError"},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions (500)."""
    logger.error(f"Internal Server Error: {str(exc)} at {request.url}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected internal error occurred.",
            "error_type": "InternalServerError"
        },
    )

