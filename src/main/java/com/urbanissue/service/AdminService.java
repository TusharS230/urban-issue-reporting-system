package com.urbanissue.service;

import com.urbanissue.model.User;
import com.urbanissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public User approveWorker(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if(!worker.getRole().equalsIgnoreCase("WORKER")) {
            throw new RuntimeException("Not a worker");
        }

        worker.setApprovalStatus("APPROVED");

        return userRepository.save(worker);
    }
}
