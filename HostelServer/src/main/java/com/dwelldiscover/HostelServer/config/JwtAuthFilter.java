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
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                // Extract username
                String username = jwtUtil.extractUsername(token);
                Claims claims = jwtUtil.extractAllClaims(token);

                System.out.println("Token Claims = " + claims);

                // ----------- FIX: extract BOTH permissions + authorities ----------
                Object permsObj = claims.get("permissions");
                Object authObj = claims.get("authorities");

                List<String> permissions = new ArrayList<>();

                if (permsObj instanceof List<?> list) {
                    list.forEach(item -> permissions.add(item.toString()));
                }

                if (authObj instanceof List<?> list) {
                    list.forEach(item -> permissions.add(item.toString()));
                }

                System.out.println("Final permissions passed to Spring = " + permissions);

                var authorities = permissions.stream()
                        .distinct()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                // Set authentication
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);

            } catch (Exception e) {
                System.out.println("Invalid Token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    public JwtAuthFilter() {
        System.out.println("🔥 JwtAuthFilter Bean Created");
    }
}
