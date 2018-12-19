package com.example.app.service;

import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public interface Dictionary {
	
	void insert(String key);
       
    public  boolean search(String key);
       
    public  void initiateDictionary();
    
    public Set<String> searchByPrefix(String searchWord);

}
