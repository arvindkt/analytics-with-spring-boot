package com.example.app.service.impl;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.modal.Word;
import com.example.app.service.Dictionary;
import com.example.app.service.WordService;

@Service
public class WordServiceImpl implements WordService{
	
	int m_iRow ;
	int m_iCol ;
	
	@Autowired
	public Dictionary m_objDicionary;
	
	//for checking neighbors for all possible directions
	static int x[] = { -1, -1, -1, 0, 0, 1, 1, 1 }; 
	static int y[] = { -1, 0, 1, -1, 1, -1, 0, 1 };
	
	//store valid words
	static Set<String> m_setValidWords = new HashSet<String>();
	

	@Override
	public char[][] createCharMatrix(Word p_objWord) {
		int l_sRow = Integer.parseInt(p_objWord.getRow());
		int l_sCol = Integer.parseInt(p_objWord.getCol());
		char[][] chMatrix = new char[l_sRow][l_sCol];
		String[] l_sWords = p_objWord.getWordsList();
		for(int i=0;i<l_sWords.length;i++) {
			String l_sWord = l_sWords[i];
			for(int j=0;j<l_sWord.length();j++) {
				chMatrix[i][j] = l_sWord.charAt(j);
			}
		}

		return chMatrix;
	}
	
	@Override
	public Set<String> findValidWords(char[][] chMatrix) {
		
		m_iRow = chMatrix.length;
		m_iCol = chMatrix[0].length;
		
		m_objDicionary.initiateDictionary();
		
		for(int i=0;i<m_iRow;i++) {
			for(int j=0;j<m_iCol;j++) {
				traverseCharacters(chMatrix,i,j);
			}
		}
		displayValidWords(m_setValidWords);
		
		return m_setValidWords;
	}

	@Override
	public void traverseCharacters(char[][] chMatrix, int a, int b) {

		for (int dir = 0; dir < 8; dir++) 
		{ 
			// Initialize starting point for current direction 
			int k, rd = a + x[dir], cd = b + y[dir]; 
			String str = Character.toString(chMatrix[a][b]);
			int len = str.length();
			for (k =0;k<len;k++) {
				if(isNeighbourExists(chMatrix, rd, cd)) { 
					str += Character.toString(chMatrix[rd][cd]);
					boolean isValidWord = m_objDicionary.search(str.toLowerCase());
					if(isValidWord) {
						m_setValidWords.add(str);
					}
					len = str.length();

					rd += x[dir]; cd += y[dir]; 
				}
			}
		} 
	}

	@Override
	public boolean isNeighbourExists(char[][] chMatrix, int i, int j) {
		if(i>=0 && i<m_iRow && j>=0 && j<m_iCol){
			return true;
		}
		return false;
	}

	@Override
	public void displayValidWords(Set<String> p_setValidWords) {
		try {
			FileWriter l_objFileWriter = new FileWriter("output/words.txt");
			BufferedWriter l_objBufferedWriter = new BufferedWriter(l_objFileWriter);
			for(String l_sValidWord : p_setValidWords) {
				l_objBufferedWriter.write(l_sValidWord+" \n");
			}
			l_objBufferedWriter.flush();
			l_objBufferedWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
