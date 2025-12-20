package com.dwelldiscover.HostelServer.config;

import com.dwelldiscover.HostelServer.service.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                String username = jwtUtil.extractUsername(token);
                Claims claims = jwtUtil.extractAllClaims(token);

                String role = (String) claims.get("role");
                String userId = (String) claims.get("userId");

                Object permsObj = claims.get("permissions");
                Object authObj = claims.get("authorities");

                List<String> permissions = new ArrayList<String>();

                // ✅ Java 8 compatible
                if (permsObj instanceof List) {
                    List<?> list = (List<?>) permsObj;
                    for (Object o : list) {
                        permissions.add(o.toString());
                    }
                }

                if (authObj instanceof List) {
                    List<?> list = (List<?>) authObj;
                    for (Object o : list) {
                        permissions.add(o.toString());
                    }
                }

                if (role != null) {
                    permissions.add("ROLE_" + role);
                }

                List<SimpleGrantedAuthority> authorities =
                        new ArrayList<SimpleGrantedAuthority>();

                for (String p : permissions) {
                    authorities.add(new SimpleGrantedAuthority(p));
                }

                org.springframework.security.core.userdetails.User userDetails =
                        new org.springframework.security.core.userdetails.User(
                                username,
                                "",
                                authorities
                        );

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    public JwtAuthFilter() {
        System.out.println("🔥 JwtAuthFilter Bean Created");
    }
}
