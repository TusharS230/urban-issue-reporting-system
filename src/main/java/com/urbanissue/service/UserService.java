package com.urbanissue.service;

import com.urbanissue.model.User;
import com.urbanissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.RuntimeErrorException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {

        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        user.setApprovalStatus("PENDING");

        if(user.getRole().equalsIgnoreCase("CITIZEN")) {
            user.setApprovalStatus("APPROVED");
        }

        return userRepository.save(user);
    }

    public List<User> getPendingUsers() {
        return userRepository.findByApprovalStatus("PENDING");
    }

    public User approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setApprovalStatus("APPROVED");
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if(user.getRole().equalsIgnoreCase("WORKER") && !user.getApprovalStatus().equalsIgnoreCase("APPROVED")) {
            throw new RuntimeException("Worker not approved yet");
        }
        return user;
    }

    public List<User> getApprovedWorkers() {
        return userRepository.findByRoleAndApprovalStatus("WORKER", "APPROVED");
    }

    public User updateCredentials(Long userId, String username, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

                Optional<User> existingUser = userRepository.findByUsername(username);

        if(existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
            throw new RuntimeException("Username already taken");
        }

        user.setUsername(username);
        user.setPassword(password);

        return userRepository.save(user);
    }
}
