"use client"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle} from "./ui/dialog"
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Trash2, Pencil } from "lucide-react";

type Note = {
    id: string;
    title: string;
    content: string;
}
export default function Notes(){

    // controlled dialog
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {


        const fetchNotes = async() => {
            try{
                const res = await fetch("/api/notes");
            const data = await res.json();
            if(!res.ok) throw new Error("Failed to fetch notes");
            setNotes(data);
            console.log(data);
            }
            catch(err){
                console.error(err);
            }
        }
        fetchNotes();

    }, [open]); // refetch notes when dialog closes

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        const formEl = e.currentTarget;            // capture once, synchronously
        const form = new FormData(formEl);
      
        const title = form.get("title")?.toString().trim();
        const content = form.get("content")?.toString().trim();
        if (!title || !content) {
          console.error("Missing fields");
          return;
        }
      
        try {
          const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      
          formEl.reset();          // reset before unmounting/closing
          setOpen(false);
        } catch (err) {
          console.error(err);
          // (optional) show a toast/error UI
        }
      };

    const deleteNote = async (id: string) => {
        try{
            const res = await fetch(`/api/notes/${id}`, {
                method: "DELETE"
            })
            if(!res.ok) throw new Error("Failed to delete note");
            // remove note
            setNotes(notes.filter(note => note.id !== id));
        }
         catch(err){
            console.error(err);
        }
    }


    return (
        <div className="bg-[#fdf6f0]">
            <h1 className="text-center mt-10 font-extrabold">Notes App</h1>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}>Add note</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add notee</DialogTitle>
                        <DialogDescription>
                        Create a quick note. Give it a title and description.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col mt-5">
                        <Input name="title" placeholder="Title" className="mb-5"/>
                        <Textarea name="content" placeholder="Content" className="mb-5"/>
                        <Button type="submit">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div>
                <h1 className="text-center">fetch all notes</h1>
                {/* map through notes */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {notes.map((note) => (
                        <li key={note.id} className="border-b p-5 m-5 rounded-lg bg-[#ffeef2]
" >
                            <h2 className="font-bold">{note.title}</h2>
                            <p>{note.content}</p>
                            <div className="gap-5 flex justify-end">
                                <Button className="bg-[#cdb4db] hover:bg-[#b39bc8]"><Pencil /></Button>
                                <Button onClick={() => deleteNote(note.id)} className="bg-[#cdb4db] hover:bg-[#b39bc8]" ><Trash2 /></Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            

        </div>
    )
}