package com.urbanissue.service;

import com.urbanissue.model.User;
import com.urbanissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.RuntimeErrorException;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {

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
}
