import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class DiseasePredictor:
    def __init__(self):
        # Features: Age, Glucose, SystolicBP, CoughDuration
        # Simple Synthetic Data for Hackathon demonstration
        np.random.seed(42)
        X_healthy = np.random.normal(loc=[30, 90, 110, 0], scale=[10, 10, 10, 1], size=(500, 4))
        X_diabetes = np.random.normal(loc=[50, 160, 130, 1], scale=[15, 25, 15, 2], size=(300, 4))
        X_ht = np.random.normal(loc=[55, 100, 160, 1], scale=[10, 15, 20, 2], size=(300, 4))
        X_tb = np.random.normal(loc=[40, 95, 120, 18], scale=[10, 10, 10, 5], size=(300, 4))
        
        X = np.vstack([X_healthy, X_diabetes, X_ht, X_tb])
        X = np.clip(X, 0, None)
        
        # Labels: 0=Healthy, 1=Diabetes, 2=Hypertension, 3=TB
        y = np.array([0]*500 + [1]*300 + [2]*300 + [3]*300)

        self.model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
        self.model.fit(X, y)

    def predict(self, age, glucose, bp, cough):
        features = np.array([[age, glucose, bp, cough]])
        probs = self.model.predict_proba(features)[0]
        
        # Probabilities
        # index 0: Healthy, 1: Diabetes, 2: Hypertension, 3: TB
        def get_level(prob):
            if prob > 0.5: return "High"
            if prob > 0.25: return "Moderate"
            return "Low"
            
        print("ML Probs:", probs) # For debug logging

        return {
            "diabetes": {"level": get_level(probs[1]), "score": int(probs[1]*100)},
            "hypertension": {"level": get_level(probs[2]), "score": int(probs[2]*100)},
            "tuberculosis": {"level": get_level(probs[3]), "score": int(probs[3]*100)}
        }

class ChatBot:
    def __init__(self):
        self.intents = [
            {"tag": "greeting", "patterns": ["hi", "hello", "hey", "good morning"], "responses": ["Hello! How can I assist you with clinical assessment today?", "Hi Doctor. Ready for consultation."]},
            {"tag": "diabetes_high", "patterns": ["patient has high sugar", "glucose over 200", "sugar level high", "diabetes risk", "diabetes"], "responses": ["For fasting sugar > 120, prescribe HbA1c test and immediate dietary restrictions.", "High glucose indicates severe diabetes risk. Initiate metformin protocol if confirmed."]},
            {"tag": "hypertension", "patterns": ["high blood pressure", "bp is 150", "hypertension problem", "systolic high", "blood pressure"], "responses": ["A Blood Pressure reading > 135/85 requires Phase-1 monitoring. Start Telmisartan 40mg after 2 confirmed high readings.", "Hypertension detected. Advise salt restriction and closely monitor."]},
            {"tag": "tuberculosis", "patterns": ["chronic cough", "coughing for 3 weeks", "blood in sputum", "tb symptoms", "tuberculosis"], "responses": ["Sputum acid-fast bacilli (AFB) test mandatory for cough > 14 days. Isolate patient.", "High suspicion of Tuberculosis. Do an immediate chest X-Ray and GeneXpert test."]},
            {"tag": "general_fever", "patterns": ["fever and chills", "patient has fever", "high temperature", "feverish", "malaria"], "responses": ["Differentiate between Malaria, Dengue, and Typhoid. Order a CBC and rapid antigen tests if fever > 3 days.", "Provide Paracetamol and hydrate. If recurring in rural area, evaluate for Malaria."]}
        ]
        self.vectorizer = TfidfVectorizer()
        corpus = []
        for intent in self.intents:
            for pattern in intent["patterns"]:
                corpus.append(pattern)
                
        self.vectorizer.fit(corpus)
        
    def get_response(self, text):
        user_vec = self.vectorizer.transform([text.lower()])
        best_score = 0
        best_intent = None
        
        for intent in self.intents:
            intent_vec = self.vectorizer.transform(intent["patterns"])
            scores = cosine_similarity(user_vec, intent_vec)
            max_score = scores.max()
            if max_score > best_score:
                best_score = max_score
                best_intent = intent
                
        if best_score > 0.2:
            return str(np.random.choice(best_intent["responses"]))
        else:
            return "Based on standard ABDM guidelines for rural healthcare, I recommend connecting with a specialized practitioner via the Telemedicine panel."

# Initialize singletons to load on startup
global_disease_predictor = DiseasePredictor()
global_chatbot = ChatBot()
