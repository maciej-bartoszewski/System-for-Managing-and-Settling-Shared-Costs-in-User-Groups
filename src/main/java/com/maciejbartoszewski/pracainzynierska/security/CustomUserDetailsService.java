package com.maciejbartoszewski.pracainzynierska.security;

import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public record CustomUserDetailsService(UserRepository userRepository) implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Integer userID = Integer.parseInt(username);
        return userRepository.findById(userID).map(CustomUserDetails::new).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}