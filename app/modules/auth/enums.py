from enum import Enum


class UserRole(str, Enum):
    OWNER = "OWNER"
    TENANT = "TENANT"