package com.example.app.controller;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.BasicJsonParser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.example.app.modal.Word;
import com.example.app.service.Dictionary;
import com.example.app.service.WordService;

@Controller
public class WordController {
	@Autowired
	WordService m_objWordService;
	
	@Autowired
	Dictionary m_objDictionary;

	@RequestMapping(value = "/index")
	public ModelAndView wordController() {
		return new ModelAndView("index");
	}

	@RequestMapping(value="/findValidWords",method=RequestMethod.POST)
	public @ResponseBody String findValidWords(Word p_objWord, HttpServletRequest request,HttpServletResponse response) {
		try {
			p_objWord.setWordsList(p_objWord.getWords().split(","));
			char chMatrix[][] = m_objWordService.createCharMatrix(p_objWord);
			Set<String> l_setValidWords = m_objWordService.findValidWords(chMatrix);
			JSONObject l_objJson = new JSONObject();
			l_objJson.put("output", l_setValidWords);
			PrintWriter l_objPrintWriter = response.getWriter();
			l_objPrintWriter.print(l_objJson);
			l_objPrintWriter.flush();
			l_objPrintWriter.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		return "index";
	}
	
	@RequestMapping(value="/searchWords",method=RequestMethod.POST)
	public @ResponseBody String searchWord(String searchWord,HttpServletRequest request,HttpServletResponse response) {
		try {
			Set<String> l_lstSearchWords =	m_objDictionary.searchByPrefix(searchWord.toLowerCase());
			JSONObject l_objJson = new JSONObject();
			l_objJson.put("searchWords", l_lstSearchWords);
			PrintWriter l_objPrintWriter = response.getWriter();
			l_objPrintWriter.print(l_objJson);
			l_objPrintWriter.flush();
			l_objPrintWriter.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
		return "index";
	}
	
	@RequestMapping("/track")
	public String track(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("-- inside track method -- ");
		
		try {
			//Decode query string from request
			String decodedData = URLDecoder.decode(request.getQueryString(), "UTF-8");
			String decodedJsonString = decodedData.substring(5, decodedData.length());
			System.out.println("-- jsonString -- " + decodedJsonString);
			
			//create map of request data to update additional information before writing to file
			BasicJsonParser jsonParser = new BasicJsonParser();
		    Map<String, Object> jsonMap = null;
		    jsonMap = jsonParser.parseMap(decodedJsonString);
			
			JSONObject analyticsData = new JSONObject();
			analyticsData.put("time", jsonMap.get("t"));
			analyticsData.put("event", jsonMap.get("e"));
			
			Map<String, Object> properties = (Map<String, Object>) jsonMap.get("kv");
			properties.put("ip", request.getRemoteAddr());
			properties.put("origin", request.getRemoteHost());
			properties.put("page", request.getHeader("referer"));
			properties.put("useragent", request.getHeader("User-Agent"));
			
			analyticsData.put("properties", properties);
			System.out.println("-- analytics data before wrting to file -- " + analyticsData.toString());
			
			//Write final analytics data in JSON format
			FileWriter file = new FileWriter("tmp/analytics.json", true);
			BufferedWriter out = new BufferedWriter(file);
			out.write(analyticsData.toString());
			out.newLine();
		    out.flush();
		    out.close();
			System.out.println("Data written to file successfully...");
			
			//Check and update cookies
			Cookie[] existingCookies = request.getCookies();
			if (existingCookies == null) {
				System.out.println("set visitor id");
				Cookie cookie = new Cookie("visitorID", properties.get("id").toString());
				response.addCookie(cookie);
				response.setStatus(200);
				
			} else {
				System.out.println("cookie exists. update session id");
				Boolean sessionIdFlag = false;
				for(Cookie c : existingCookies) {
					if(c.getName() == "sessionId") {
						c.setValue(request.getSession().getId());
						sessionIdFlag = true;
					}
				}
				if (!sessionIdFlag) {
					Cookie cookie = new Cookie("sessionID", request.getSession().getId());
					response.addCookie(cookie);
					response.setStatus(200);
				}
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
		
		
		return "index";
	}
	 

}
