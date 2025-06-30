export interface JwtPayload {
	id: number; // This will store the _id value
	iat?: number;
	exp?: number;
}
