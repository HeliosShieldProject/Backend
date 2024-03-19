import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from entities.base_entity import Base


class Config(Base):
    __tablename__ = "configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_ip = Column(String, nullable=False)
    private_key = Column(String, nullable=False, unique=True)
    server_id = Column(UUID(as_uuid=True), ForeignKey("servers.id"))
    server = relationship("Server", back_populates="configs")
