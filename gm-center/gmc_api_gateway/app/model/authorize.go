package model

import (
	uuid "github.com/gofrs/uuid"
)

type Authorize struct {
	TokenUUID uuid.UUID `json:"tid" example:"550e8400-e29b-41d4-a716-446655440000" format:"uuid"`
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	UserUUID  uuid.UUID `json:"uid" example:"550e8400-e29b-41d4-a716-446655440000" format:"uuid"`
	Role      string    `json:"role"`
	// jwt.StandardClaim
}
