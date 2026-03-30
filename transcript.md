# Dedalus-Thoughtbox link - Transcript

**Date:** Mar 25, 2026
**Duration:** 44 mins
**Participants:** Aleph Patroy, Dedalus Labs, Windsor Nguyen, Simon Liang, Simon Liang

---

**Aleph Patroy** [0:07]
Hello, AI note takers.

**Windsor Nguyen** [1:53]
What's up,

**Aleph Patroy** [1:54]
Windsor? Oh,

**Windsor Nguyen** [1:55]
hey. Wait.

**Aleph Patroy** [1:57]
Hey. What's up, man?

**Windsor Nguyen** [1:58]
Computer. I don't have the Oh, I don't I'll I'll I'll send it, like wait. I'm gonna join another computer. Give me one sec. Is

**Aleph Patroy** [2:06]
that your

**Windsor Nguyen** [2:08]
I I just

**Aleph Patroy** [2:08]
sent

**Windsor Nguyen** [2:08]
you the link.

**Aleph Patroy** [2:29]
Hello.

**Simon Liang** [2:30]
How's it going? What's

**Aleph Patroy** [2:32]
up?

**Simon Liang** [2:33]
Good. Good. Good. Good to see you. We have probably we have this meeting. I'm really excited because Marching Face is also a couple of our mind, and I wanted to learn from you for a while. So good to

**Aleph Patroy** [2:43]
get started. Oh, yes, man.

**Simon Liang** [2:48]
Alright. Sorry. Before I start, how do I pronounce your name again? I don't have any

**Aleph Patroy** [2:53]
Hey, what?

**Simon Liang** [2:54]
Adith? Sorry. I feel so ashamed after all the breaking.

**Aleph Patroy** [2:58]
No. No. Literally, like, I'm the only person that pronounces that word

**Simon Liang** [3:02]
that way,

**Aleph Patroy** [3:03]
so it's fine.

**Simon Liang** [3:04]
Yeah. Yeah. That's fine. Cool. But good good to connect with you. So how's it been? How's everything?

**Aleph Patroy** [3:11]
Man,

**Simon Liang** [3:12]
it's doing

**Aleph Patroy** [3:13]
alright. I'm about got a paid product out, so that's pretty cool.

**Simon Liang** [3:17]
Sunny, wait. What's the do you have to answer the website right now?

**Aleph Patroy** [3:20]
Yeah. So I've got, my my product is called Thoughtbox.

**Simon Liang** [3:24]
Thoughtbox or Smartbox?

**Aleph Patroy** [3:26]
Thoughtbox.

**Simon Liang** [3:27]
Oh, that's the you have been working on this for a while. Right?

**Aleph Patroy** [3:30]
I have. So I it it took a while to kind of, like, get to where I could figure out where there was gonna be a wide market for it. Because kind of when I

**Simon Liang** [3:40]
was

**Aleph Patroy** [3:42]
doing the break in thing it was kind of just like a cool piece of technology, which nobody buys.

**Simon Liang** [3:49]
So

**Aleph Patroy** [3:51]
it it was, so kind of where I ended up was, I'm about done with it now.

**Simon Liang** [3:57]
The

**Aleph Patroy** [3:57]
website's up everything. But, where I where I came to is I made it into a code mode server. So instead of regular MCP, you're just you know, it's making TypeScript calls back and forth to the server. And I've gotten it so that, if you've got a coding agent and a code base and, the agent, is calling Thoughtbox, it's only able to call Thoughtbox to alter any of the state of the code.

**Simon Liang** [4:28]
Interesting.

**Aleph Patroy** [4:29]
Because you can, you can expose the code base just

**Simon Liang** [4:32]
as

**Aleph Patroy** [4:32]
an API.

**Simon Liang** [4:34]
Oh, wow. So it's turning code out of the service, basically. You're connecting, but not through MCP protocol. It's just through calling this end point.

**Aleph Patroy** [4:42]
So it it is an MCP server, but it's exposed as a TypeScript API.

**Simon Liang** [4:47]
Oh, interesting. By the way, what's your what? Do we guys have a website? Because I thought it's thoughtbox.ai is some consulting firm.

**Aleph Patroy** [4:55]
Oh, yeah. Here. Let me, pull it up.

**Simon Liang** [4:58]
So I'd love to follow how you guys are doing over

**Aleph Patroy** [5:00]
time. Yeah. The, here. I actually just got the site live, so it's not it's not gonna do much for another couple of days.

**Simon Liang** [5:10]
That's fine. That's fine.

**Aleph Patroy** [5:11]
Here we

**Simon Liang** [5:12]
go. Awesome. Okay. I would love to check it out. By the way, what's, what's the plan for the marketplace? You guys want to, deploy this on the marketplace or anything else?

**Aleph Patroy** [5:28]
So I do wanna deploy it on the marketplace, but that's actually what I was looking to talk to you guys about was

**Simon Liang** [5:35]
Sure.

**Aleph Patroy** [5:35]
So I had, I I had been talking to Pilash like, I guess about a month ago, about maybe doing some stuff with the marketplace and I just like, I didn't have bandwidth at the time. But so I was I was looking, you know, kinda to just see, you know, if you guys were still looking to push the marketplace and I sent something over to Nikki and she said, yeah, that you definitely were. And I actually kind of got an interesting idea for how we might be able to work together, on the marketplace.

**Simon Liang** [6:09]
Sure. Let's talk about it.

**Aleph Patroy** [6:11]
So first of all, do you know,

**Simon Liang** [6:13]
do you know

**Aleph Patroy** [6:13]
quality diversity algorithms?

**Simon Liang** [6:16]
No. I do not.

**Aleph Patroy** [6:17]
Cool. So it's it's basically, in short, like, this idea that if you're trying to do something, really, really, really hard, and you don't know necessarily what factors are leading to, like, success or failure, that

**Simon Liang** [6:33]
you're

**Aleph Patroy** [6:34]
guaranteed to fail if you're just going at that one outcome. But if you try, like, just lots of different things, then eventually you get there.

**Simon Liang** [6:43]
So

**Aleph Patroy** [6:44]
it's so the the the guy that kinda came up with this, field, he described it as if you're back in May in Egypt and you want to have a computer that has, like, a huge number of teraflops, too bad. Like, you know, you have to come up with compute first. But, like, if you let human society, like, evolve over time, but, like, eventually you get there. So, the way I was thinking of it was because I was trying to figure out, like, when I was looking at the marketplace why there weren't just huge numbers of people, using it. It's the best security anywhere in the ecosystem by a lot. You know, obviously, like, really cracked team.

**Simon Liang** [7:27]
You you got you got a link for this?

**Aleph Patroy** [7:29]
What's up?

**Simon Liang** [7:30]
You have a link for this, by the way? Love to see because it's

**Aleph Patroy** [7:34]
first

**Simon Liang** [7:34]
time I'm hearing you about it. I can't believe this is such a popular server I haven't heard.

**Aleph Patroy** [7:38]
Oh, quality diversity?

**Simon Liang** [7:41]
Yeah. Can you send me a link? Wait. Is this a particular algorithm that's been, it's just an algorithm, or it's also deployed as a MCP server?

**Aleph Patroy** [7:50]
Oh oh, no. So it's, this is it's it's a it's an algorithm. I've now I

**Simon Liang** [7:55]
do

**Aleph Patroy** [7:55]
have it, actually instituted on one of my MCP servers.

**Simon Liang** [7:59]
Awesome.

**Aleph Patroy** [8:00]
But here, I'll I'll share this with you because

**Simon Liang** [8:03]
Yeah. I saw the web page for their paper. The paper looks really cool.

**Aleph Patroy** [8:06]
Yeah. Here, watch watch this talk. It's, yeah. Jeff pointed it's really good.

**Simon Liang** [8:11]
Okay.

**Aleph Patroy** [8:12]
I'm sending

**Simon Liang** [8:12]
this.

**Aleph Patroy** [8:13]
So kind of what I ended up coming to was, like, just that, like, there's so many other marketplaces that are, like, a little bit worse. And it it's kind of, like, you would wonder, like, what you would come to the marketplace for that you wouldn't get elsewhere.

**Simon Liang** [8:33]
Yeah. So

**Aleph Patroy** [8:33]
what

**Simon Liang** [8:34]
so

**Aleph Patroy** [8:34]
what I thought was was that maybe, the way to figure that out would be to make a shit ton of small products using, like, various combinations of the different services that the agent can, access through the marketplace. And if you make a bunch of iterations on that over and over, like, one at least one of them is gonna become somewhat popular. But so, like, the way I was thinking about it, I came up with this for my own product, I guess, about

**Simon Liang** [9:13]
a

**Aleph Patroy** [9:13]
a month ago when I was trying to figure out, like, why people would pay for it. And I was thinking about I was like, man, you know what I would pay

**Simon Liang** [9:20]
for? If

**Aleph Patroy** [9:20]
somebody could get me, like, Shake Shack delivered to my place for 10 the $10 three times in a row.

**Simon Liang** [9:29]
I've

**Aleph Patroy** [9:29]
never seen that. And and I'm just like, you know, the absolute value of the money that I would be saving, like, is trivial, but, like, you know, it feels like, you know, just trivial magic almost if you can get that to happen. And so the way I thought about it was you've got all

**Simon Liang** [9:45]
of the options. Our our our Internet is really bad. Do you mind if I join you on my phone? It might be slightly better. Because we're cutting

**Aleph Patroy** [9:51]
off.

**Simon Liang** [9:51]
Give me one quick second.

**Aleph Patroy** [9:53]
For sure. We have two Simons. That was just one Simon now.

**Simon Liang** [10:13]
Great. Well, I have no idea what's showing up as my with my English name. I'm gonna turn off the, video just for better call quality. Is that okay? Yeah,

**Aleph Patroy** [10:23]
that's fine. Okay,

**Simon Liang** [10:24]
cool. Sorry, continue.

**Aleph Patroy** [10:28]
Yeah, so

**Simon Liang** [10:28]
But I thought

**Aleph Patroy** [10:30]
microservices

**Simon Liang** [10:30]
is really smart. I don't know if you've been following MCP space, but I know like, FastMCP, there are new iterations from FastMCP three. It's literally just about how do you port different servers and stack them on top of each other. It's kind of like a conglomerate of different servers. And then, so that that that's that seems to be one direction in this space. So that resonate.

**Aleph Patroy** [10:53]
So I thought about different direction Oh.

**Simon Liang** [10:56]
Which

**Aleph Patroy** [10:56]
is that so, like, that's so those servers, you can think of them as, like, vertical servers.

**Simon Liang** [11:01]
K.

**Aleph Patroy** [11:02]
You've got another server that you could have, like, so, like, almost like a gateway to, the entire marketplace. Like like, let's say, Thoughtbox or I think, Win's new, TypeScript SDK has this as well. But so it it exposes, it exposes not a bunch of servers to the model, but a bunch of tools. So, like, let's say you have, like, two servers that do very similar things. So, like, Exa and FireCrawl. Like, both of them have a crawler. Both of them have web search. Both of them have, like, agentic search. But, like,

**Simon Liang** [11:41]
you

**Aleph Patroy** [11:41]
might wanna choose one tool or the other versus one server or the other because they're not, like,

**Simon Liang** [11:47]
all

**Aleph Patroy** [11:47]
better than one or the other. Yeah. Fire crawls probably better at scraping and and x is probably better at search.

**Simon Liang** [11:54]
So

**Aleph Patroy** [11:54]
you've got the model just seeing all of these different tools just as API endpoints, and it's able to just write code to interact with them, in in a way that, like, would be crazy context expensive, if it was just, like, a a giant, stacked vertical server. So that that could be like

**Simon Liang** [12:22]
That makes sense.

**Aleph Patroy** [12:23]
What's that?

**Simon Liang** [12:24]
That makes sense.

**Aleph Patroy** [12:27]
But

**Simon Liang** [12:27]
I I just out of curiosity, so you are saying, essentially, I I'm I want to use different tools from different servers instead of just binding them to one servers. So you are saying there's there needs to be some smart routing for the different kind of tools, basically?

**Aleph Patroy** [12:44]
Yeah. So you would my my guess is how you would do that is, whenever, like, you know, at periodic intervals, you would have some kind of index of all of the different, you know, tools that are available on the marketplace at one time. And then that would get updated however often you wanna do it on the back end. Here, I'll I'll show you a server I did the other day that might illustrate this. Oh, crap. So this is this was, this was actually originally my first, like, AI product that I tried to do, and then I just came back and made it a code vote server the other night. So I will, here in just a second, share my screen. And alright. So just open the folder. Stallion, bunch of stuff that's very poorly organized. I'm looking this up. Can you still hear me, by the way?

**Simon Liang** [14:21]
Sorry. I for some reason, I clicked on mute, but I can hear you okay. Can you hear

**Aleph Patroy** [14:25]
me okay? Yeah. So I'm gonna I'm gonna just, like, clone this in here.

**Simon Liang** [14:31]
Okay.

**Aleph Patroy** [14:32]
I'll go into there, and I'll export a couple of

**Simon Liang** [14:39]
environment

**Aleph Patroy** [14:40]
variables that you you you can steal them if you want them. They're they're completely useless. Let's see. So I'll just I can make the IP here. So and then the secret. So this right here and I've gotta see how you actually it's been so long since I've run one of these. It's, like, not Dockerized. Yep.

**Simon Liang** [15:13]
So

**Aleph Patroy** [15:13]
this is, this is written in the, the TypeScript library effect. And so if I just go down here to dot env, there. Oh, I guess I'm gonna have to put that in there. But what you'll see is once I'm done moving some of this over, which I don't really need these two, What you'll see is that I've got this giant open API spec that I load up into the environment.

**Simon Liang** [15:49]
Sure.

**Aleph Patroy** [15:50]
And that. Yeah, there we go. And, so it's right here. And this thing is fucking huge. So, you know, you've got a you've got just a this is, I think, about, like, 210 API endpoints that have, like, really big objects coming out

**Simon Liang** [16:13]
the inside. Yeah.

**Aleph Patroy** [16:15]
So what I can do, if I just go here and have, like, a little m c p dot JSON, still in the wrong folder. And yep. And that's not the thing. Okay. There we go.

**Simon Liang** [16:38]
Is it basically exposing all the tools schema along with API endpoints?

**Aleph Patroy** [16:44]
Say that again?

**Simon Liang** [16:46]
Are you exposing a tool schema with an API endpoints? So for the reason I'm asking you this is, wouldn't this just be the very context of our little problem that, MCP has where we are injecting all the tool schema into the context?

**Aleph Patroy** [16:59]
So it's all, it's not injected into the context in that way. It's it's available the way that, like, the existence of API endpoints is available. Like,

**Simon Liang** [17:11]
how do you discover those API endpoints is the question. Right? You have to give them either a tool schema to orient their API endpoints or they have to hit them one by one. How does it really work here?

**Aleph Patroy** [17:21]
Yeah. Awesome. Let me, dangerously I really should have alias this after all this time. Alright. So if we go into NCP here and oh, yeah. I gotta run the run the server first. Oh, whoops. Cool. K. And should run it. Hang on one sec. Sorry. Let me let's let's get Claude to figure it out. I'm sure it's something with just this project. Okay.

**Simon Liang** [18:23]
Ben, can you probably talk through the commercial angle of this?

**Aleph Patroy** [18:27]
How

**Simon Liang** [18:27]
does it work with our market posts?

**Aleph Patroy** [18:31]
Mhmm. So the way that this would work is is that just by having, like, a large number of products that come out that aren't necessarily, like, Daedalus products, What you would get at some point is there are there are going to be a lot of people or at least a lot more people wanting to use one combination of all of these different tools or one small set of combinations of these different tools than all the rest of them combined.

**Simon Liang** [19:04]
Yes. And

**Aleph Patroy** [19:06]
I'm what I'm thinking that that would do is is that would, number one, like, give people, like, something on the product end rather than the infrastructure end as developers where they're, like, going here to get something because, like, something, valuable was made with the infrastructure. And then also, like, from Daedalus' perspective, it would clarify, like, where the value is in the marketplace from the outside in a way that maybe, like, having the regular creator's program wouldn't. I I'm not saying that, like, the the creator's program is necessarily, like, a bad idea, but it's also dependent on, like, people wanting to sign on and come and do this.

**Simon Liang** [19:56]
Wait. Sorry. Your let me just make sure I understand. So you your this proposal is changing our marketplace into entirely API endpoint based and then make people only be exposed to tool schema? Or do they be exposed to tools?

**Aleph Patroy** [20:11]
No. So it would basically, all this would be is just, like, user generation, like, bringing people in. But it wouldn't necessarily be, like, everybody has to go through that way or that's the only thing that you can do.

**Simon Liang** [20:25]
As in, like, not everyone needs to deploy MCP server, but they can still exploit exploit the API endpoints for their tools on our marketplace so they can still profit out of that angle. Does that make sense?

**Aleph Patroy** [20:37]
I'm I'm sorry. Could you say that again? You cut out for a sec.

**Simon Liang** [20:39]
As in, like, you are saying no one needs to deploy their MCP servers, but as long as you have your tools somewhere, the somewhere is a question mark. I'm not sure whether it is hosted or not. Like, how does this API endpoint work? But setting that aside, you are proposing, in in addition to our marketplace, other than MCP servers, they also have the tools that's being a part of our marketplace?

**Aleph Patroy** [20:59]
So what people would be deploying wouldn't change. It's just the the form factor that, a model would access it with could be either the typical thing that you get loaded up with NCP, or it could be this code mode kind of thing.

**Simon Liang** [21:21]
One Woah.

**Aleph Patroy** [21:22]
Yeah. So one of these manages to code mode is, like, the the different clients, out there in the ecosystem, like, are really, really jagged in what they support, but, like, pretty much everybody supports tools. And then, obviously, like, the, the the context advantages. I

**Simon Liang** [21:39]
don't

**Aleph Patroy** [21:39]
know if you've read the the blog post from, CloudFlare.

**Simon Liang** [21:47]
No. They they are very TypeScript focused. Our MCPs are slightly more Python focused, so we don't really, we we should follow more, but not yet.

**Aleph Patroy** [21:57]
Yeah. You

**Simon Liang** [21:58]
can.

**Aleph Patroy** [21:58]
So

**Simon Liang** [21:58]
can I just give you the context to how this works, though? Just to completely understand the problem so we can have more lots of conversation. My question is mostly around okay. API endpoint makes sense, but all our infrastructure is built around MCP with auth. Right? So in the case where need to do OAuth into, for instance, your Gmail server, I'm sure you know all this from, like, working with Smith. Right? How the authentication works with the servers? And I think authentication is probably the most important thing in MCP where, like, you have to authenticate your services. Most people don't use MCP simply as tools anymore. They use it as to access different services. Right? If it's just tools, people just use skills.

**Aleph Patroy** [22:37]
Mhmm. Yes. So on the outside, I'll, like, I know that it so in general, basically, what the the model is doing is that it's, it's running code in, like, a sandbox environment on the server. Now as far

**Simon Liang** [22:56]
as how

**Aleph Patroy** [22:56]
Through

**Simon Liang** [22:57]
Thoughtbox infrastructure?

**Aleph Patroy** [22:59]
With what?

**Simon Liang** [23:00]
The soft box infrastructure? Where does this sandbox come from?

**Aleph Patroy** [23:05]
So the the sandbox is on it wouldn't necessarily have to be thought box, but, I mean, it could be. Yeah.

**Simon Liang** [23:13]
You guys have a sandbox?

**Aleph Patroy** [23:16]
Yes. So I

**Simon Liang** [23:17]
thought

**Aleph Patroy** [23:17]
it okay. Yeah. So, yeah, I mean, if it were to be, like, Thoughtbox going into Daedalus and stuff, like, I'm sure that you guys would wanna do your thing, as far as getting d auth, implemented on that, in in the way that you would want it. I will say that, like, on on the question of, like, how you guys specifically do that, with code mode, I would I would think that it wouldn't be a problem just because the TypeScript SDK that Wynn came up with, is also code mode. But, but, like, I was, saying her, like, TypeScript, Python, like, the pattern works the same either way.

**Simon Liang** [23:56]
That makes sense. There's some, like, lingering question from my side. I just wanna get clear.

**Aleph Patroy** [24:02]
I

**Simon Liang** [24:02]
think exposing tools, obviously, as an idea that makes it makes sense to me. Right? So my my question is, you are saying, like, whenever you access the API, it runs in sandbox. So this tool is basically executing sandbox. So what I'm hearing from our side is, basically, all the MCP servers that basically requires auth needs to be reconfigured and thought of in almost normal structure to either fitting Thoughtbox, infrastructure or our infrastructure or whatever it is. But so so, yes, there's a quite a a lot of engineering efforts from our side. Also, like, I haven't even discussed with Windsor on whether this approach on tool centric makes sense yet. So I think, that's the first thing. Second thing is just mechanics. I I ideally, I feel like API endpoints is obviously the best way. It's most native to agents. They they use codes really well. But how do you even let the agents know what API endpoints to hit for different kind of serve for different kind of use cases? That's a go back to the question I was asking earlier of context. Right? If you don't load in the tool schema, how do they know which API endpoint you have?

**Aleph Patroy** [25:12]
So the way that I've, the way that I've done this at least, in the past is, so I've basically just given an instruction to the agent, that's, you know, in either, either a prompt, primitive with MCP or just, in a tool description.

**Simon Liang** [25:33]
And

**Aleph Patroy** [25:33]
what I'll say is, notice the different tools that you have available to you and categorize them based on what they do. So it wouldn't be the sort of thing where, and to answer your question before from before, you wouldn't have to reconfigure all of the other different servers that are on the marketplace because you would be proxying them, through one central gateway.

**Simon Liang** [26:01]
But this how does auth works with this gateway? I know you talked about sandbox, but I haven't go gotten your infrast perspective. So for instance, let me give you a concrete example. All the reason why, d auth is or auth in general with MCP is a issue is because we need a auth server. Right? You basically centralize the entire management auths manage auth services problem. But it seems to be running the sandbox. You are you are saying we should we can just connect the auth server to that sandbox, and it's basically performing the same, thing as executing a tool. But in that case, we're basically basically, what we need to expose to the users is a complete if in in in analogies, the MCP, client code and ask them to execute their client code in sandbox and then still insert all the environment variables such as auth server into that sandbox. Am I understanding this correctly, generally?

**Aleph Patroy** [26:58]
Or

**Simon Liang** [26:58]
are you saying the API doesn't even require client code in this case? Because the the reason why we have a SDK with our, client code is because we have a very particular way of doing off where you have to specify what exactly is the API key you need to inject into MCP server and what exactly is the connection or what exactly is the scope of access people need. So it's just a little hard to imagine, like, doing this without any code whatsoever by just hitting the MCP API endpoint.

**Aleph Patroy** [27:30]
I'll tell you what. Because I don't know specifically how that works with d auth, I would need

**Simon Liang** [27:38]
Or maybe, generally, with any MCP server that has the key injected at runtime instead of the MCP server that has a key baked into server? Maybe, like, separate from the auth, I just wanna know on generally, how you are thinking of how do you inject key at runtime for the MCP servers as tools. We're not in this case, it's just tools. Right? But how do you inject API keys?

**Aleph Patroy** [27:59]
So they're they're, they're lazy loaded. I would need to

**Simon Liang** [28:06]
go

**Aleph Patroy** [28:06]
back and take a look and see, like, where exactly, in in, like, the process of the,

**Simon Liang** [28:12]
like,

**Aleph Patroy** [28:13]
the exchange of information, with the middleware, that is. So I'll I'll I'll admit

**Simon Liang** [28:20]
ignorance

**Aleph Patroy** [28:20]
of that as far as, like

**Simon Liang** [28:23]
No worries. The reason why I'm asking you all of this is just because we feel like MCP landscape recently with the with how skills is turning out is, generally, people are using this as authentication way of using either linear or Slack. So it become more

**Aleph Patroy** [28:37]
of the

**Simon Liang** [28:37]
auth, it becomes bigger mode within MCP, and that's the reason why we're focusing on this a lot. But we can also rewind just, maybe take a single case of this. Imagine all the MCP servers you are seeing is doesn't have require authentication. You are saying you basically expose each of the tools as API endpoints and then compose them into a microservice within each API endpoints, or is the agent dynamically calling different services to compose their own services they need based on the tools?

**Aleph Patroy** [29:09]
Right. It's, it's the second one.

**Simon Liang** [29:11]
Okay. Got it.

**Aleph Patroy** [29:12]
Yeah.

**Simon Liang** [29:12]
That makes sense. I I understand where second part yours okay. Also, just going back to the tools schema question, you are saying, you'd be more be more straightforward telling them what exactly the API endpoints they need to use. That saves you a problem with, context engineering slash, like, loading in the tool schema. Is that the vision here?

**Aleph Patroy** [29:35]
Yes. So it's it's, depending on how you count it, somewhere between ninety seven and ninety nine, percent token savings, upfront. The, where you would still be able to, like, get observability. So if you I'll I'll actually, take it back to

**Simon Liang** [29:54]
what

**Aleph Patroy** [29:54]
I was doing earlier so I can just show you.

**Simon Liang** [29:57]
K. So Wait. I can finally see this, by the way. I I couldn't see the screen sharing earlier.

**Aleph Patroy** [30:03]
Here we go. So let's let's see, let's see what, let's see what, Claude came up with in the background. I think it's I think it's good. Okay. It's like live demo mode. Yeah. I'll tell you why.

**Simon Liang** [30:33]
I'll

**Aleph Patroy** [30:34]
just hook up another code mode server. That's fine. I'll just go to

**Simon Liang** [30:38]
We're also happy to get a demo afterwards if that works better. But, wait. Okay. I I have a lot of questions with regards to this, but because right now, our I think we we understand what you're doing with, like, tools, exposing tools as endpoints. And then for us, we just need we just need to think about, like, what exactly the mechanics.

**Aleph Patroy** [30:57]
So,

**Simon Liang** [30:57]
essentially, you are saying you can expose those API endpoints on our marketplace. So the marketplace doesn't have to be restricted to, MCP server. It can also be tool specific, like, individual tool

**Aleph Patroy** [31:08]
specific.

**Simon Liang** [31:08]
Is that correct?

**Aleph Patroy** [31:09]
Right. Right. So the, so the the unit, of capability is, at the level of an API endpoint versus a server.

**Simon Liang** [31:22]
Okay. So the current way we are thinking about this, right, in terms of how we are, doing this on our end is you do this as a local function for all the tools you you need that doesn't need authentication. So, ideally, if you can use these tools in pragmatically, you just specify this in the SDK and then do local and remote tool hand off, like, however, what you wanna call it. But I think there's there's merits in hitting the API servers. There's merits in having the marketplace that basically just host different tools that expose itself with API queries. And that part, I need to think about this with wings or whether it makes sense for the marketplace. By the way, like, I'm not saying like, it's not a diplomatic way of saying where no. Right? Because we're really

**Aleph Patroy** [32:05]
wanting

**Simon Liang** [32:05]
to condition the marketplace into the agent extension just for your visibility. Like, because the MCP, obviously, the hype is lying down, and then people have been saying, say, oh, I also place a very significant role within the agent ecosystem. So we're trying to market this more towards whatever you can pair with your large English model to make it useful. So this can very, very well be a part of the puzzle, but I think we just need to internally rely on this. But what, what you're saying what Thoughtbot Box can provide you to us, is this the infra, or are you providing me a bunch of endpoints we can directly catalog in the marketplace?

**Aleph Patroy** [32:40]
So this would be, so I I I do have a few servers. But, so if you see here on my screen so there's two two tools exposed here. And, the model is being exposed to like 210, tools at this point. So let's see, like, what's in the context. Got a lot lot of skills and agents. So but, like, all of this, is, you know, generally, like, pretty heavy. But the server that I'm I'm hooked up to, there's only these four at the end, and they're they're very, very light. So, like, here here's an example. So let me just go take a look and okay. So I'll go so they can summarize. And then what I'll do

**Simon Liang** [33:43]
I'll

**Aleph Patroy** [33:44]
go over here to one of these reasoning sessions.

**Simon Liang** [33:48]
Okay. With respect to this this different service you're showing me, are you planning on just deploying those onto our marketplace as the individual API endpoints, or are you saying, like, Dropbox is devising try to create this infra to turn different tools into API endpoints just from my own understanding?

**Aleph Patroy** [34:04]
So it's, so it's the latter is, the main thing I'm thinking about. I I

**Simon Liang** [34:09]
actually

**Aleph Patroy** [34:10]
wanted to ask you a question

**Simon Liang** [34:11]
Sure.

**Aleph Patroy** [34:11]
About the, about the local process that you

**Simon Liang** [34:15]
have

**Aleph Patroy** [34:15]
now. Because that's something I've actually got going with a different one of these things. I I don't know if you've seen, channels that came out on Call It Code.

**Simon Liang** [34:25]
Yeah. Yeah. Of course. It's

**Aleph Patroy** [34:26]
been a big

**Simon Liang** [34:27]
hit. I've been using it quite a lot.

**Aleph Patroy** [34:29]
Yeah. No. I I saw that and, it just immediately started rigging up a bunch of different servers. But Yeah. What? There we go. So

**Simon Liang** [34:41]
Okay. So what what's the input that's required for, in fact, to turn this into API endpoints?

**Aleph Patroy** [34:48]
So you would

**Simon Liang** [34:51]
you

**Aleph Patroy** [34:51]
would, be having this server as a router or a proxy between all of the other, servers that are out there. Understood.

**Simon Liang** [35:01]
Does it need to be deployed, for other servers? For I know understand I understand that there needs to be a proxy from your server. But do we need to have, all other servers to be hosted, or can they be local, or how do they get access to your server in the first place?

**Aleph Patroy** [35:17]
I know that, I mean, what I was thinking of was was that they would be hosted.

**Simon Liang** [35:23]
Yeah.

**Aleph Patroy** [35:23]
I mean, I I'm guessing, like, I mean, if you have, like, a, if you've got just, like, a,

**Simon Liang** [35:31]
you know,

**Aleph Patroy** [35:31]
like, a a tunnel or something like that

**Simon Liang** [35:33]
Sure.

**Aleph Patroy** [35:35]
Yeah. I wouldn't see any any reason why there.

**Simon Liang** [35:39]
Okay. So you are saying we basically tunnel those instant key servers into this server so we can proxy them as a URL if if you have endpoints for tools. Right? That's the vision?

**Aleph Patroy** [35:53]
Let me make sure I'm getting this right. So

**Simon Liang** [35:56]
and

**Aleph Patroy** [35:57]
I'll here. How about this? I'll I'll just kinda share the the way that I think about it when I

**Simon Liang** [36:01]
when I'm

**Aleph Patroy** [36:01]
thinking about, like, there's a hosted server and then there's, like, a local daemon. Is that it's almost like, it's almost like, you know, this local daemon between the agent and the server, is able to it it's able to receive events. So information about the, asynchronous outcomes of a tool call or of a just any call to that server, are visible to the model.

**Simon Liang** [36:44]
Okay. I think, Olive, maybe the good way for us to move forward here is if you can send us a code repo, it might just be good for our own digestion to understand mechanics. But I would I got a broad stroke with what's what we're going for here, which is using your server to proxy them into API endpoints.

**Aleph Patroy** [37:02]
But how

**Simon Liang** [37:02]
does it how does it benefit you? What's the monetization process? Do you want us to pay you by commission, or what what's the vision here?

**Aleph Patroy** [37:09]
So I was thinking that we would have, like, a period of somewhere between four to six weeks, where you're paying me, a base rate, and then there's some kind of incentive rate

**Simon Liang** [37:22]
on

**Aleph Patroy** [37:22]
top of that, based on outcomes that you guys feel are are important to Daedalus' business.

**Simon Liang** [37:29]
Okay. We can talk to Lisa about this, but maybe the other way we can make this work, right,

**Aleph Patroy** [37:35]
is

**Simon Liang** [37:35]
entirely literate by usage. However however many servers ended up getting proxy through you ended up going to your Us, you can set up a price for this proxy fee in our marketplace already. So we do revenue sharing. That's why we're already testing. You can see some servers on marketplace that's charging you charging you money back to pay. You can basically set a price and automatically just get you. We're only taking 20% of the entire you, which is cost fee. I like, honestly, if you are willing, we're also happy to waive this revenue sharing and make all the feedback that goes into you, but this will be entirely metered by how many people want to lose it to. And then just to caveat, what this also implies is, they probably need to run this MCP server either where their l m l m client lists like cursor where they add to MCP servers and then for in some shape or form they proxy other servers including your MCP servers which you have to we have to determine after receiving the code. But in any case, that's the first route where the revenue sharing can do. I'm happy to do that. In terms of us paying a subscription fee, I think to be very, very honest, if I bring this to Windsor and Kathy, this will be slightly tricky because we have we have a lot of subscription going on. Also, like, we only try to pay for the things that's really necessary and that's proven growth. So if this adapts being, like, a very important outcome, obviously, we love to transition into this partnership. We'll pay you some kind of base fee if that, service our users. So but I think we might just need the way forward by seeing how, how this works, by seeing how many people are willing to call your servers in the first place. How does that sound?

**Aleph Patroy** [39:12]
Yeah. So I I think probably, I think, probably on both of our ends, what we'll wanna do first is, first of all, let me get Thoughtbox, like, prepared to be that proxy. Because because at this point, it's just, like, posted on a on a Cloud Run, service with a super based back end. So I would yeah. I didn't need to do a little bit of coding there. But, like, let's see what it ends up looking like, you know, both on my end, on your end, and then maybe we we come back together. I don't know. How how many days are you guys, thinking would be good?

**Simon Liang** [39:53]
As long as you can get your product with this in place, we're happy to call number.

**Aleph Patroy** [39:58]
Okay. Cool. So, let's see. I'm I'm very unavailable tomorrow. Pretty much

**Simon Liang** [40:06]
next week.

**Aleph Patroy** [40:06]
On Friday.

**Simon Liang** [40:07]
I think this week is really big for us.

**Aleph Patroy** [40:09]
Okay. Cool.

**Simon Liang** [40:12]
Maybe like say next Wednesday?

**Aleph Patroy** [40:14]
Yeah sounds good, let me let me put something on the calendar and I'll just I'll send it to your email if that's cool.

**Simon Liang** [40:20]
Sounds good but I think yeah I think the way forward to me is really straightforward maybe it's talking with MCP servers

**Aleph Patroy** [40:26]
you

**Simon Liang** [40:27]
you have to figure out what's the mechanics for people turning their tools into API endpoints via your server. We're happy to see if we can host their API endpoints through us automatically by making this easier deployment deployment flow for them as well.

**Aleph Patroy** [40:46]
Second

**Simon Liang** [40:46]
thing, I also wanted to ask you of, obviously you've been very experienced in the Smith through MCP community. I wanted to check if you know anyone who might be still interested in doing this creator program that we are still very much advocating for.

**Aleph Patroy** [40:59]
Yeah. So I I sent stuff over, when Blash and I had talked over to a few people.

**Simon Liang** [41:09]
By the way, did you did did you know he, Blash actually left the company in just

**Aleph Patroy** [41:14]
a

**Simon Liang** [41:14]
little context?

**Aleph Patroy** [41:16]
Yeah. So I I mean, as best as I could gather, I mean, a lot of them like, a lot of them are that I would have contacted are, like, running companies now.

**Simon Liang** [41:24]
Oh,

**Aleph Patroy** [41:24]
got

**Simon Liang** [41:25]
it.

**Aleph Patroy** [41:25]
So or or, like, you know, early employees at companies. So that was a big part of it. In terms of the Smithree ecosystem, a big part of the problem there is that the smithtery, like, community ecosystem just really frankly isn't doing very well. I don't really see a whole lot of activity there anymore. But, like, here, let me, let me put something on here and just, like, give myself a reminder for tomorrow so I can go into just at least the Discords and do this.

**Simon Liang** [41:59]
No pressure. I you're just curious. If you have contacts, that'd be great.

**Aleph Patroy** [42:03]
Yeah. I I know when I kinda dropped off with with Pilash, it was it was just like it just became apparent all of a sudden where I was like, I'm I'm I'm way busier than I thought I was kind of thing. But, yes, happy to do that. Let me just get ChatGPT to remind me. Love

**Simon Liang** [42:20]
it. Please

**Aleph Patroy** [42:21]
don't mind point poor pro. Yeah.

**Simon Liang** [42:25]
I know. Have you tried codecs automation? It's also pretty good at reminding people.

**Aleph Patroy** [42:29]
Have I have I tried what?

**Simon Liang** [42:31]
Codex automation. That's a codec desktop desktop.

**Aleph Patroy** [42:35]
Oh, man. I like, I can't use it. It it hammers my CPU.

**Simon Liang** [42:38]
Oh, yeah. That's heavy use of CPU.

**Aleph Patroy** [42:41]
Yeah. Compute,

**Simon Liang** [42:42]
man.

**Aleph Patroy** [42:42]
I don't really do that, like, on the CLI or the Versus Code extension. Like, I use them there all the time.

**Simon Liang** [42:49]
Yeah. They pop they're it's much more in-depth, you know, system wide.

**Aleph Patroy** [42:55]
Yeah. It it's,

**Simon Liang** [42:56]
it's

**Aleph Patroy** [42:56]
one of those things where I'm, like, kind of surprised because I'm, like, my laptop is not bad.

**Simon Liang** [43:02]
But, yeah.

**Aleph Patroy** [43:03]
It's, I mean, it's just brutal on the CPU.

**Simon Liang** [43:06]
Yeah, I'd say sure.

**Aleph Patroy** [43:10]
By

**Simon Liang** [43:10]
the way, are you based in SF right now?

**Aleph Patroy** [43:13]
I'm not in SF right now. I'm planning on being an SF here in, like, a little over two weeks. I haven't gotten the plane ticket yet. But,

**Simon Liang** [43:21]
Okay. Cool.

**Aleph Patroy** [43:21]
Of course.

**Simon Liang** [43:23]
Happy to have you visit office whenever. But, yeah, let's look back on this next week. We'd also appreciate obviously some contacts for creator program.

**Aleph Patroy** [43:33]
We do

**Simon Liang** [43:34]
I do have to call for another call, but let's, let me, send me

**Aleph Patroy** [43:39]
send me

**Simon Liang** [43:39]
an invite via email. I can reply to your, reply

**Aleph Patroy** [43:42]
to all

**Simon Liang** [43:42]
of this via email, if that's okay?

**Aleph Patroy** [43:44]
What's your email? Can you put it in the chat?

**Simon Liang** [43:46]
Yes. Happy to. For

**Aleph Patroy** [43:56]
your worst case scenario, I'd just, like, run a website. Like, hey. Give me all the emails for people

**Simon Liang** [44:00]
at

**Aleph Patroy** [44:01]
at Daedalus, but this is easier. Alright.

**Simon Liang** [44:05]
Sorry. I'll just build typos there. But thanks so much. Great to talk to you today.

**Aleph Patroy** [44:10]
Yeah. Yeah. Yeah. Good to talk to you. I'll see you I'll

**Simon Liang** [44:13]
see you next

**Aleph Patroy** [44:13]
week. Alright?

**Simon Liang** [44:14]
Yes. See you very soon. Bye bye.
