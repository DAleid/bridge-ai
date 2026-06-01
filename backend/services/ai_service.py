import time
from groq import Groq
from config import settings

client = Groq(api_key=settings.groq_api_key)
MODEL = "llama-3.3-70b-versatile"


def chat(messages: list, system: str = None) -> dict:
    all_messages = []
    if system:
        all_messages.append({"role": "system", "content": system})
    all_messages.extend(messages)

    start = time.time()
    response = client.chat.completions.create(
        model=MODEL,
        messages=all_messages,
        max_tokens=2048,
    )
    elapsed = time.time() - start

    return {
        "content": response.choices[0].message.content,
        "tokens": response.usage.total_tokens,
        "time": round(elapsed, 2),
    }


def analyze_data(data: dict, question: str) -> dict:
    prompt = f"""أنت محلل بيانات خبير. حلّل البيانات التالية وأجب على السؤال.

البيانات:
{data}

السؤال: {question}"""
    return chat([{"role": "user", "content": prompt}])


def process_document(text: str, task: str, target_language: str = "Arabic") -> dict:
    task_prompts = {
        "summarize": f"لخّص النص التالي:\n\n{text}",
        "analyze": f"حلّل النص وأعطِ insights:\n\n{text}",
        "extract_entities": f"استخرج الكيانات المهمة من:\n\n{text}",
        "translate": f"ترجم إلى {target_language}:\n\n{text}",
    }
    return chat([{"role": "user", "content": task_prompts[task]}])
