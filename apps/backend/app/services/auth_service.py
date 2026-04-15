from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.auth_repository import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserResponse

AVATAR_PALETTE = [
    "#52B6FF",
    "#55D6BE",
    "#F8A45B",
    "#F774A3",
    "#B88CFF",
    "#8FD14F",
]


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)

    def _pick_avatar_color(self, seed: str) -> str:
        return AVATAR_PALETTE[sum(ord(char) for char in seed) % len(AVATAR_PALETTE)]

    def register(self, payload: RegisterRequest) -> AuthResponse:
        if self.users.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь с таким email уже зарегистрирован")

        user = self.users.create(
            email=payload.email.lower(),
            name=payload.name.strip(),
            password_hash=hash_password(payload.password),
            avatar_color=self._pick_avatar_color(payload.email.lower()),
        )
        self.db.commit()
        self.db.refresh(user)

        token = create_access_token(str(user.id))
        return AuthResponse(access_token=token, user=UserResponse.model_validate(user))

    def login(self, payload: LoginRequest) -> AuthResponse:
        user = self.users.get_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")

        token = create_access_token(str(user.id))
        return AuthResponse(access_token=token, user=UserResponse.model_validate(user))
