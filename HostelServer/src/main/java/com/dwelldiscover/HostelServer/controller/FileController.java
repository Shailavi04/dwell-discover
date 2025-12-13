package com.dwelldiscover.HostelServer.controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.gridfs.GridFsResource;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private GridFsTemplate gridFsTemplate;   // ✅ FIXED

    @Autowired
    private GridFsOperations gridFsOperations; // ✅ FIXED

    // ---------------------------------------------
    // ⭐ 1. UPLOAD FILE
    // ---------------------------------------------
    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String fileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType()
        ).toString();

        return ResponseEntity.ok().body(fileId);
    }

    // ---------------------------------------------
    // ⭐ 2. DOWNLOAD / SERVE IMAGE BY ID
    // URL → /api/files/{id}
    // ---------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable String id) throws IOException {

        GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(id))
        );

        if (gridFSFile == null)
            return ResponseEntity.notFound().build();

        GridFsResource resource = gridFsOperations.getResource(gridFSFile);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + resource.getFilename())
                .body(new InputStreamResource(resource.getInputStream()));
    }
}
