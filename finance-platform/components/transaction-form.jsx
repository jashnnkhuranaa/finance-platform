const React = require("react");
const { useForm } = require("react-hook-form");
const z = require("zod");
const { zodResolver } = require("@hookform/resolvers/zod");
const { toast } = require("react-toastify");
const { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } = require("./ui/form");
import Input from "./ui/input";
import Button from "./ui/button";
import { createTransaction } from "../app/api/transactions/actions/create-transaction";
import { useAccounts } from "@/hooks/useAccount";
import { useCategories } from "@/hooks/useCategories";
const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = require("./ui/select");
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
const { CalendarIcon } = require("lucide-react");
import Calendar from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
const { format } = require("date-fns");

const formSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().min(1, "Category is required"),
  payee: z.string().min(1, "Payee is required"),
  amount: z.number({ required_error: "Amount is required" }).min(-1000000).max(1000000),
  notes: z.string().optional(),
});

function TransactionForm({ onSuccess, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: Object.assign(
      { date: new Date(), accountId: "", categoryId: "", payee: "", amount: 0, notes: "" },
      defaultValues
    ),
  });

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("date", values.date.toISOString());
    formData.append("accountId", values.accountId);
    formData.append("categoryId", values.categoryId);
    formData.append("payee", values.payee);
    formData.append("amount", values.amount.toString());
    if (values.notes) formData.append("notes", values.notes);

    const result = await createTransaction(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Transaction created successfully");
      form.reset();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account */}
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payee */}
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input placeholder="Add a payee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "text-xl",
                      field.value < 0 ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {field.value < 0 ? "-" : "+"}
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Optional notes" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create transaction
        </Button>
      </form>
    </Form>
  );
}

export { TransactionForm, formSchema };