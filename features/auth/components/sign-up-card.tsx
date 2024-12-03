"use client";

import * as z from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";

const SignUpCard = () => {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({
      json: values,
    });
  };

  return (
    <Card
      className="w-full h-full md:w-[486px] border-none shadow-none"
    >
      <CardHeader
        className="flex items-center justify-center text-center p-7"
      >
        <CardTitle
          className="text-2xl font-extrabold tracking-normal"
        >
          Create an account
        </CardTitle>
      </CardHeader>

      <div
        className="px-7"
      >
        <DottedSeparator />
      </div>

      <CardContent
        className="p-7"
      >
        <Form
          {...form}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full rounded-lg"
              size="lg"
              disabled={isPending}
            >
              {isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>

      <div
        className="px-4"
      >
        <DottedSeparator />
      </div>

      <CardContent
        className="flex items-center justify-center p-7"
      >
        <p
          className="text-xs font-normal"
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
          >
            <span
              className="text-[#0077b6]"
            >
              Sign In
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
