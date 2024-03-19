import uuid

from data.enums.country_enum import countries
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from entities.base_entity import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    server_url = Column(String, nullable=False)
    public_key = Column(String, nullable=False, unique=True)
    country = Column(countries, nullable=False)
    configs = relationship("Config", back_populates="server")