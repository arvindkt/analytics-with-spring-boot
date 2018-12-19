package com.example.app.service.impl;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.app.service.Dictionary;

@Service
public class DictionaryImpl  implements Dictionary{
	 
	final int ALPHABET_SIZE = 26; 
	
	TrieNode root;  
    

      
    class TrieNode 
    { 
        TrieNode[] children = new TrieNode[ALPHABET_SIZE]; 
        boolean isEndOfWord; 
        char data;
        TrieNode(){ 
            isEndOfWord = false; 
            for (int i = 0; i < ALPHABET_SIZE; i++) 
                children[i] = null; 
            	
        } 
    }; 
       
   public void insert(String key) 
    { 
        int level; 
        int length = key.length(); 
        int index; 
        
        TrieNode pCrawl = root; 
       
        for (level = 0; level < length; level++) 
        { 
        	pCrawl.data =key.charAt(level);
            index = key.charAt(level) - 'a'; 
            if (pCrawl.children[index] == null) 
                pCrawl.children[index] = new TrieNode(); 
       
            pCrawl = pCrawl.children[index]; 
        } 
       
        pCrawl.isEndOfWord = true; 
    } 
       
    public  boolean search(String key) 
    { 
        int level; 
        int length = key.length(); 
        int index; 
        TrieNode pCrawl = root; 
       
        for (level = 0; level < length; level++) 
        { 
            index = key.charAt(level) - 'a'; 
       
            if (pCrawl.children[index] == null) 
                return false; 
       
            pCrawl = pCrawl.children[index]; 
        } 
       
        return (pCrawl != null && pCrawl.isEndOfWord); 
    } 
       
    public  void initiateDictionary() {
    	
    	root = new TrieNode(); 
        FileReader l_objFileReader = null;
        BufferedReader l_objBufferedReader = null;
        try {
        	l_objFileReader = new FileReader("input/dictionary_words.txt");
        	l_objBufferedReader = new BufferedReader(l_objFileReader);
        	String line = null;
        	while((line = l_objBufferedReader.readLine()) !=null) {
        		    insert(line);
        	}
        	
        }catch(FileNotFoundException e) {
        	e.printStackTrace();
        } catch (IOException e) {
			e.printStackTrace();
		}
    }
    
    
 
    public Set<String> searchHelper(TrieNode root,String word,String ans,Set<String> p_setSearchResult)
    {
    	try
    	{
    		if(word.length()==0)
    		{
    			if(root.isEndOfWord == true)
    			{
    				p_setSearchResult.add(ans);
    			}
    			for(int i=0;i<26;i++)
    			{
    				TrieNode temp=root.children[i];
    				if(temp !=null)
    				{
    					char tempData =  (char) ( 97 +i);    					
    					searchHelper(temp,word,ans+tempData,p_setSearchResult);
    				}
    			}
    		}
    		int childIndex=word.charAt(0)-'a';
    		TrieNode child=root.children[childIndex];
    		if(child == null)
    		{
    			return p_setSearchResult ;
    		}
    		ans=ans+word.charAt(0);
    		searchHelper(child,word.substring(1),ans,p_setSearchResult);

    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    	}
    	return p_setSearchResult;
    }

    @Override
    public Set<String> searchByPrefix(String searchWord) {
    	initiateDictionary();
    	Set < String > m_lstSearchResult = new HashSet < String > ();
    	return searchHelper(root, searchWord,"",m_lstSearchResult);
    }
}
