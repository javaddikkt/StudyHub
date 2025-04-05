package com.project.studyhub;

import com.project.studyhub.entity.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtils {
    private final String secret = "fms8hrns74nr7rvsfkjb87678bq3eg78ybjdjc8jgc";

    private final Duration lifetime = Duration.ofMinutes(10);

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(AppUser user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("sub", user.getUsername());
        claims.put("role", user.getRole().toString());
        Date issuedAt = new Date();
        Date expiresAt = new Date(issuedAt.getTime() + lifetime.toMillis());
        return Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(issuedAt)
                .expiration(expiresAt)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getUsername(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String getRole(String token) {
        return "ROLE_".concat(getClaimsFromToken(token).get("role").toString());
    }

    public Long getId(String token) {
        return getClaimsFromToken(token).get("id", Long.class);
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
