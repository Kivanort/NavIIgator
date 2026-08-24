import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const YANDEX_API_URL = "https://ai.api.cloud.yandex.net/v1/chat/completions";
const YANDEX_MODEL = "gpt://b1gdlc1lblclo0jopj9n/yandexgpt/latest";
const MAX_MESSAGE_LENGTH = 2000;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildSystemPrompt(profileAnswers: string, language: string): string {
  const langNames: Record<string, string> = {
    ru: "русском",
    en: "English",
    kk: "қазақ тілінде",
    sr: "srpskom",
  };
  const langName = langNames[language] || "русском";

  return `Ты — AI-гид по Яндекс Музее. Твоя задача — помогать пользователю в интерактивной экскурсии по музею компьютеров и технологий.

Вот ответы пользователя на опрос (каждый ответ с новой строки — имя, возраст, уровень знаний IT, профессия, хобби через запятую, время на экскурсию, стиль общения):
${profileAnswers}

Доступные экспонаты музея (45 штук):
1. Первый сервер Яндекса (1997, Россия) — сервер на FreeBSD, работа поисковой Яндекс-Web
2. Библейский компьютерный справочник (1994, Россия) — программа поиска в тексте Библии, предок Поиска Яндекса
3. Apple I (реплика) (1976, США) — первый компьютер Apple, одноплатная система
4. Apple IIe (1983, США) — успешный домашний компьютер 1980-х
5. Commodore PET 2001-N (1979, США) — один из первых массовых ПК
6. Commodore 64 (1982, США) — самый продаваемый 8-битный компьютер в мире
7. Sinclair ZX Spectrum (1982, Великобритания) — недорогой ПК, познакомил поколение с программированием
8. Sinclair QL (1984, Великобритания) — бизнес-модель от Синклера
9. Агат-7 (1985, СССР) — советский учебный ПК, архитектура Apple II
10. Электроника БК 0010 (1985, СССР) — известный советский бытовой компьютер
11. Yamaha YIS-503IIIR «КУВТ2» (1985, Япония) — MSX2 для советских школ
12. IBM PC 5150 (1981, США) — задал стандарт IBM PC-совместимости
13. IBM Portable PC 5155 (1984, США) — портативная версия IBM PC/XT
14. Apple Macintosh Classic (1990, США) — доступный Macintosh с GUI
15. NeXTcube (1990, США) — рабочая станция Джобса, первый www-сервер
16. Apple iMac G3 (1998, США) — полупрозрачный моноблок, возвращение Apple
17. Apple iMac G4 (2002, США) — дизайн «настольная лампа»
18. Intel Dot.Station ROL BOX (2000, США) — моноблок для веба от AOL
19. Fujitsu Siemens Stylistic ST5020 (2006, Япония) — планшет с Windows XP Tablet PC
20. МЦСТ Эльбрус 801-PC (2018, Россия) — российский ПК на процессоре Эльбрус
21. Робот-доставщик Яндекса 1-го поколения (2019, Россия) — автономный робот для доставки
22. Amiga 500 (1992–1996, США) — мультимедийный компьютер Commodore
23. ZX Spectrum финальная модификация (1990, Великобритания) — последняя модель линейки
24. Sinclair ZX80 (1978–1980, Великобритания) — первый коммерческий Sinclair
25. Sinclair ZX81 (1981, Великобритания) — преемник ZX80, £69,95
26. Texas Instruments TI-99/4A (1981, США) — цветной 16-битный ПК
27. Диалоговый вычислительный комплекс ДВК-3 (1985–1986, СССР) — комплекс для образования
28. Compaq Portable (1983, США) — первый портативный IBM PC-совместимый
29. Mac mini (2005, США) — компактный Mac без дисплея
30. Dragon 32 (1982, Великобритания) — 8-битный ПК с синтезом речи
31. Amstrad CPC 464 (1984, Великобритания) — «всё в одном»
32. PowerBook G4 (2001, Китай) — алюминиевый ноутбук Apple
33. БК 0011М (1989–1991, СССР) — копия Apple IIe
34. Апогей БК 01Ц (1988–1989, СССР) — учебная модификация БК
35. Электроника МС 0511 (УКНЦ) (1988–1990, СССР) — учебно-кабинетный компьютер
36. Robotron KC 87 (1986–1990, ГДР) — компьютер ГДР
37. Самоделка, клон Sinclair ZX Spectrum (2010-е, Россия) — современная реплика
38. EC 1841 (1988–1990, СССР) — 16-битный микрокомпьютер ЕС ЭВМ
39. Atari 520ST (1985, Швейцария/США) — пионер MIDI и GEM
40. HP Vectra VL (1992–1994, США) — бизнес-ПК HP
41. Macintosh LC580 (1994, США) — бюджетный моноблок Apple
42. Копия Apple 1 (2010-е) — современная реплика платы
43. Atari 130XE (1985, США) — улучшенная 8-битная линейка Atari
44. Sony HB-F700P (1984, Япония) — японский 8-битный ПК
45. iMac G5 (2003–2004, США) — моноблок на PowerPC G5

Маршруты музея:
- "Маршрут по технике Apple" (экспонаты: 3,4,14,16,17,29,42,45) — 8 экспонатов
- "Для программистов" (экспонаты: 1,2,3,5,6,9,10,11,12,13,14,18,20,23,24,26,27,30,33,34,36,38,40,43,44) — 25 экспонатов
- "Для предпринимателей" (экспонаты: 1,3,5,6,9,11,13,14,17,19,22,23,26,27,30,33,34,43,44,45) — 20 экспонатов
- "Для геймеров" (экспонаты: 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,22,23,26,29,30,31,32,33,34,35,36) — 27 экспонатов
- "Для новичка" (экспонаты: 1,3,5,7,9,12,15,17,21,22,27,37,42,44) — 14 экспонатов
- "Все экспонаты" — все 45 экспонатов

Правила общения:
- Общайся на ${langName} языке.
- Если стиль пользователя "formal" — общайся формально, используя "вы".
- Если стиль пользователя "informal" — общайся неформально, используя "ты".
- Отвечай кратко и по делу, используй эмодзи где уместно.
- Помогай выбирать маршруты и рассказывай об экспонатах.
- Если пользователь спрашивает про музей, маршруты или экспонаты — давай подробные ответы.
- Будь дружелюбным и энтузиазмным AI-гидом.`;
}

export async function POST(request: NextRequest) {
  const rl = rateLimit(request);
  if (!rl.success) {
    return Response.json(
      { error: "Превышен лимит запросов. Попробуйте через минуту." },
      { status: 429 }
    );
  }

  try {
    const { messages, profileAnswers, language } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.YC_API_KEY) {
      console.error("YC_API_KEY is not set");
      return Response.json(
        { error: "AI-сервис не настроен. Обратитесь к администратору." },
        { status: 500 }
      );
    }

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === "user" && lastUserMsg.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Слишком длинное сообщение (максимум ${MAX_MESSAGE_LENGTH} символов).` },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(
      profileAnswers || "Нет данных опроса",
      language || "ru"
    );

    const apiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await fetch(YANDEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.YC_API_KEY}`,
      },
      body: JSON.stringify({
        model: YANDEX_MODEL,
        messages: apiMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Yandex GPT API error ${response.status}:`, errorText);

      if (response.status === 401) {
        return Response.json(
          { error: "Невалидный ключ API. Обратитесь к администратору." },
          { status: 401 }
        );
      }

      return Response.json(
        { error: "Ошибка при обращении к AI-сервису" },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content =
                  parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ content })}\n\n`
                    )
                  );
                }
              } catch {
                // skip malformed JSON lines
              }
            }
          }
        } catch (err) {
          console.error("Stream processing error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
