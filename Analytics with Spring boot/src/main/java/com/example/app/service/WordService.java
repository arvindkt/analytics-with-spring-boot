package com.example.app.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.app.modal.Word;

@Service
public interface WordService {
	
	public char[][] createCharMatrix(Word p_objWord);
	
	public Set<String> findValidWords(char[][] chMatrix);
	
	public void traverseCharacters(char[][] chMatrix, int row, int col);
	
	public boolean isNeighbourExists(char[][] chMatrix ,int i, int j);
	
	public void displayValidWords(Set<String>p_setValidWords);
	
}
