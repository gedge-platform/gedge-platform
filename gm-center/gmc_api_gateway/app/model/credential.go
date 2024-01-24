package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Credential struct {
	_id        primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	CredentialName		string    `json:"CredentialName,omitempty" bson:"name"`
	ProviderName	string		`json:"ProviderName,omitempty" bson:"type"`
	IdentityEndpoint	string		`json:"IdentityEndpoint,omitempty" bson:"endpoint"`
	Username	string		`json:"Username,omitempty" bson:"username"`
	Password	string		`json:"Password,omitempty" bson:"password"`
	DomainName	string		`json:"DomainName,omitempty" bson:"domain"`
	ProjectID	string		`json:"ProjectID,omitempty" bson:"project"`
	ClientId	string		`json:"ClientId,omitempty" bson:"access_id"`
	ClientSecret	string		`json:"ClientSecret,omitempty" bson:"access_token"`
	Region	string		`json:"Region,omitempty" bson:"region"`
	Zone	string		`json:"Zone,omitempty" bson:"zone"`
	KeyPair string		`json:"KeyPair,omitempty" bson:"keypair"`
	Created_at	time.Time   `json:"created_at"`
}
