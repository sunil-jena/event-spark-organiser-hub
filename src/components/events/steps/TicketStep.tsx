import React, { useState } from "react";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  Package,
  Tag,
  Clock,
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  X,
  ChevronRight,
  IndianRupee,
  Info,
  CalendarRange,
} from "lucide-react";
import * as Yup from "yup";

// Toast notification
import { useToast } from "@/hooks/use-toast";

// Types (adjust these types as needed)
import { DateFormValues, TicketFormValues, TimeSlotFormValues, VenueFormValues } from "./types";

interface TicketConfiguratorProps {
  ticketTypes: TicketFormValues[];
  setTicketTypes: (types: TicketFormValues[]) => void;
  dates: DateFormValues[];
  timeSlots: TimeSlotFormValues[];
  venues: VenueFormValues[];
  onSubmit: (tickets: TicketFormValues[]) => void;
}

// Helper function to format Indian price
const formatIndianPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get ticket category description
const getTicketCategoryDescription = (category: string): string => {
  switch (category) {
    case "standard":
      return "Regular ticket with standard access";
    case "early-bird":
      return "Discounted tickets available before the general sale";
    case "vip":
      return "Premium tickets with exclusive benefits";
    case "season-pass":
      return "Access to multiple events or dates";
    default:
      return "";
  }
};

// Helper function to get ticket category label
const getTicketCategoryLabel = (category: string): string => {
  switch (category) {
    case "standard":
      return "Standard";
    case "early-bird":
      return "Early Bird";
    case "vip":
      return "VIP";
    case "season-pass":
      return "Season Pass";
    default:
      return category;
  }
};

// Helper function to format event date
// In this example, we assume the date is provided as a number (e.g. 21122023 for Dec 21, 2023)
// Adjust this function if you already have Date objects.
const formatEventDate = (dateNumber: number): Date => {
  const str = dateNumber.toString().padStart(8, "0");
  const day = parseInt(str.slice(0, 2), 10);
  const month = parseInt(str.slice(2, 4), 10) - 1; // Month is 0-indexed
  const year = parseInt(str.slice(4, 8), 10);
  return new Date(year, month, day);
};

// --- Validation Schema for the New Ticket Form ---
const ticketValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ticket name is required"),
  price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
  quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  availableDateIds: Yup.array().when("isAllDates", {
    is: false,
    then: (schema) => schema.min(1, "Please select at least one date"),
  }),
  availableTimeSlotIds: Yup.array().when("isAllTimeSlots", {
    is: false,
    then: (schema) => schema.min(1, "Please select at least one time slot"),
  }),
  saleStartDate: Yup.date().when("isLimited", {
    is: true,
    then: (schema) => schema.required("Sale start date is required"),
  }),
  saleEndDate: Yup.date().when("isLimited", {
    is: true,
    then: (schema) =>
      schema
        .required("Sale end date is required")
        .min(Yup.ref("saleStartDate"), "Sale end date must be after sale start date"),
  }),
});

const TicketStep: React.FC<TicketConfiguratorProps> = ({
  ticketTypes,
  setTicketTypes,
  dates,
  timeSlots,
  venues,
  onSubmit,
}) => {
  const { toast } = useToast();

  // Local state for tickets and edit mode
  const [ticketList, setTicketList] = useState<TicketFormValues[]>(ticketTypes || []);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeTicketId, setActiveTicketId] = useState<string>("");

  // Multi-select states for badges
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  // Handle description items (array of strings)
  const [descriptionItems, setDescriptionItems] = useState<string[]>([""]);

  // Initial form values for the ticket form
  const initialValues: TicketFormValues = {
    id: uuidv4(),
    name: "",
    description: [""],
    price: 0,
    quantity: 100,
    ticketType: "paid",
    ticketCategory: "standard",
    entryPerTicket: 1,
    bookingPerTicket: 1,
    ticketStatus: "active",
    isAllDates: true,
    availableDateIds: [],
    isAllTimeSlots: true,
    availableTimeSlotIds: [],
    dateIds: [],
    timeSlotIds: [],
    isAllVenues: true,
    venueIds: [],
    isLimited: false,
    isCombo: false,
    saleStartDate: new Date(),
    saleEndDate: undefined,
  };

  // Formik hook
  const formik = useFormik<TicketFormValues>({
    initialValues,
    validationSchema: ticketValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const updatedValues = { ...values };

      // Populate date, time slot, and venue fields if "apply to all" is selected
      if (updatedValues.isAllDates) {
        updatedValues.availableDateIds = dates.map((d) => d.id);
        updatedValues.dateIds = dates.map((d) => d.id);
      } else {
        updatedValues.dateIds = updatedValues.availableDateIds;
      }
      if (updatedValues.isAllTimeSlots) {
        updatedValues.availableTimeSlotIds = timeSlots.map((t) => t.id);
        updatedValues.timeSlotIds = timeSlots.map((t) => t.id);
      } else {
        updatedValues.timeSlotIds = updatedValues.availableTimeSlotIds;
      }
      if (updatedValues.isAllVenues) {
        updatedValues.venueIds = venues.map((v) => v.id);
      }

      // Format dates if necessary
      if (updatedValues.saleStartDate && typeof updatedValues.saleStartDate === "string") {
        updatedValues.saleStartDate = new Date(updatedValues.saleStartDate);
      }
      if (updatedValues.saleEndDate && typeof updatedValues.saleEndDate === "string") {
        updatedValues.saleEndDate = new Date(updatedValues.saleEndDate);
      }

      // Update description from items
      updatedValues.description = descriptionItems.filter((item) => item.trim() !== "");
      if (updatedValues.description.length === 0) {
        updatedValues.description = [""];
      }

      if (isEditMode) {
        // Update existing ticket
        const updated = ticketList.map((ticket) =>
          ticket.id === updatedValues.id ? updatedValues : ticket
        );
        setTicketList(updated);
        setTicketTypes(updated);
        setIsEditMode(false);
        toast({
          title: "Ticket updated",
          description: "The ticket has been successfully updated.",
          variant: "default",
        });
      } else {
        // Add new ticket
        const updated = [...ticketList, updatedValues];
        setTicketList(updated);
        setTicketTypes(updated);
        toast({
          title: "Ticket added",
          description: "The ticket has been added to your event.",
          variant: "default",
        });
      }

      resetForm();
      setActiveTicketId("");
      setSelectedDates([]);
      setSelectedTimeSlots([]);
      setSelectedVenues([]);
      setDescriptionItems([""]);
    },
  });

  // Function to toggle the selection of a badge-based item
  const toggleSelection = (
    id: string,
    selectedList: string[],
    setSelected: (ids: string[]) => void,
    fieldName: string
  ) => {
    let newSelection: string[] = [];
    if (selectedList.includes(id)) {
      newSelection = selectedList.filter((item) => item !== id);
    } else {
      newSelection = [...selectedList, id];
    }
    setSelected(newSelection);
    formik.setFieldValue(fieldName, newSelection);
  };

  // Initialize editing a ticket
  const editTicket = (id: string) => {
    const ticket = ticketList.find((t) => t.id === id);
    if (ticket) {
      setActiveTicketId(id);
      setIsEditMode(true);
      formik.setValues({
        ...ticket,
        saleStartDate: ticket.saleStartDate ? new Date(ticket.saleStartDate) : new Date(),
        saleEndDate: ticket.saleEndDate ? new Date(ticket.saleEndDate) : undefined,
      });
      setDescriptionItems(ticket.description && ticket.description.length > 0 ? ticket.description : [""]);
      setSelectedDates(ticket.availableDateIds || []);
      setSelectedTimeSlots(ticket.availableTimeSlotIds || []);
      setSelectedVenues(ticket.venueIds || []);
    }
  };

  // Delete a ticket
  const deleteTicket = (id: string) => {
    const updatedList = ticketList.filter((t) => t.id !== id);
    setTicketList(updatedList);
    setTicketTypes(updatedList);
    if (id === activeTicketId) {
      setActiveTicketId("");
      setIsEditMode(false);
      formik.resetForm();
      setSelectedDates([]);
      setSelectedTimeSlots([]);
      setSelectedVenues([]);
      setDescriptionItems([""]);
    }
    toast({
      title: "Ticket deleted",
      description: "The ticket has been removed from your event.",
      variant: "destructive",
    });
  };

  // Calculate total ticket value
  const totalValue = ticketList.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // Helper to display validation errors
  const getFieldError = (fieldName: string) => {
    return formik.touched[fieldName as keyof TicketFormValues] &&
      formik.errors[fieldName as keyof TicketFormValues]
      ? String(formik.errors[fieldName as keyof TicketFormValues])
      : null;
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setActiveTicketId("");
    formik.resetForm();
    setSelectedDates([]);
    setSelectedTimeSlots([]);
    setSelectedVenues([]);
    setDescriptionItems([""]);
  };

  // Description items management
  const addDescriptionItem = () => {
    setDescriptionItems([...descriptionItems, ""]);
  };

  const updateDescriptionItem = (index: number, value: string) => {
    const newItems = [...descriptionItems];
    newItems[index] = value;
    setDescriptionItems(newItems);
  };

  const removeDescriptionItem = (index: number) => {
    if (descriptionItems.length > 1) {
      const newItems = descriptionItems.filter((_, i) => i !== index);
      setDescriptionItems(newItems);
    }
  };

  // Optional: Remove selected badge (for extra control)
  const removeSelectedDate = (dateId: string) => {
    const newDates = selectedDates.filter((id) => id !== dateId);
    setSelectedDates(newDates);
    formik.setFieldValue("availableDateIds", newDates);
  };

  const removeSelectedTimeSlot = (timeSlotId: string) => {
    const newTimeSlots = selectedTimeSlots.filter((id) => id !== timeSlotId);
    setSelectedTimeSlots(newTimeSlots);
    formik.setFieldValue("availableTimeSlotIds", newTimeSlots);
  };

  const removeSelectedVenue = (venueId: string) => {
    const newVenues = selectedVenues.filter((id) => id !== venueId);
    setSelectedVenues(newVenues);
    formik.setFieldValue("venueIds", newVenues);
  };

  return (
    <div className="space-y-6">
      <Card className="border-brand-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Ticket" : "Ticket Types"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isEditMode
                ? "Update the selected ticket's details"
                : "Configure the tickets available for your event"}
            </CardDescription>
          </div>
          {isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              className="flex items-center hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Editing
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={formik.handleSubmit}
            className="mb-6 border rounded-lg p-6 bg-gradient-to-b from-slate-50 to-blue-50 shadow-sm animate-fade-in"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              {isEditMode ? (
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
              ) : (
                <PlusCircle className="h-5 w-5 mr-2 text-emerald-600" />
              )}
              {isEditMode ? "Edit Ticket" : "Add a New Ticket"}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium flex items-center">
                  Ticket Name <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. General Admission"
                  className={`transition-all duration-200 ${getFieldError("name")
                    ? "border-destructive"
                    : "hover:border-primary focus:border-primary"
                    }`}
                />
                {getFieldError("name") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("name")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketType" className="font-medium flex items-center">
                  Ticket Type <span className="text-destructive ml-1">*</span>
                </Label>
                <Select
                  value={formik.values.ticketType}
                  onValueChange={(value) => {
                    formik.setFieldValue("ticketType", value);
                    if (value === "free") {
                      formik.setFieldValue("price", 0);
                    }
                  }}
                >
                  <SelectTrigger id="ticketType" className="w-full hover:border-primary transition-colors">
                    <SelectValue placeholder="Select ticket type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketCategory" className="font-medium flex items-center">
                  Ticket Category <span className="text-destructive ml-1">*</span>
                </Label>
                <Select
                  value={formik.values.ticketCategory}
                  onValueChange={(value) => formik.setFieldValue("ticketCategory", value)}
                >
                  <SelectTrigger id="ticketCategory" className="w-full hover:border-primary transition-colors">
                    <SelectValue placeholder="Select ticket category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="early-bird">Early Bird</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="season-pass">Season Pass</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTicketCategoryDescription(formik.values.ticketCategory)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketStatus" className="font-medium flex items-center">
                  Ticket Status <span className="text-destructive ml-1">*</span>
                </Label>
                <Select
                  value={formik.values.ticketStatus}
                  onValueChange={(value) => formik.setFieldValue("ticketStatus", value)}
                >
                  <SelectTrigger id="ticketStatus" className="w-full hover:border-primary transition-colors">
                    <SelectValue placeholder="Select ticket status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="sold out">Sold Out</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="filling fast">Filling Fast</SelectItem>
                    <SelectItem value="coming soon">Coming Soon</SelectItem>
                    <SelectItem value="few tickets left">Few Tickets Left</SelectItem>
                    <SelectItem value="offline sell">Offline Sell</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError("ticketStatus") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("ticketStatus")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="font-medium flex items-center">
                  Price (₹) <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0"
                    className={`pl-8 ${getFieldError("price")
                      ? "border-destructive"
                      : "hover:border-primary focus:border-primary transition-colors"
                      }`}
                    disabled={formik.values.ticketType === "free"}
                  />
                </div>
                {getFieldError("price") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("price")}</p>
                )}
                {formik.values.ticketType === "free" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Price is set to 0 for free tickets
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-medium flex items-center">
                  Quantity Available <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="100"
                  className={`transition-all duration-200 ${getFieldError("quantity")
                    ? "border-destructive"
                    : "hover:border-primary focus:border-primary"
                    }`}
                />
                {getFieldError("quantity") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("quantity")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPerTicket" className="font-medium flex items-center">
                  Entries Per Ticket <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="entryPerTicket"
                  name="entryPerTicket"
                  type="number"
                  min="1"
                  value={formik.values.entryPerTicket}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="1"
                  className={`transition-all duration-200 ${getFieldError("entryPerTicket")
                    ? "border-destructive"
                    : "hover:border-primary focus:border-primary"
                    }`}
                />
                {getFieldError("entryPerTicket") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("entryPerTicket")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingPerTicket" className="font-medium flex items-center">
                  Bookings Per Ticket <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="bookingPerTicket"
                  name="bookingPerTicket"
                  type="number"
                  min="1"
                  value={formik.values.bookingPerTicket}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="1"
                  className={`transition-all duration-200 ${getFieldError("bookingPerTicket")
                    ? "border-destructive"
                    : "hover:border-primary focus:border-primary"
                    }`}
                />
                {getFieldError("bookingPerTicket") && (
                  <p className="text-destructive text-xs mt-1">{getFieldError("bookingPerTicket")}</p>
                )}
              </div>

              {/* Combo Ticket Switch */}
              <div className="space-y-2 sm:col-span-2 bg-blue-50 p-4 rounded-md shadow-inner hover:bg-blue-100 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isCombo" className="flex items-center space-x-2 font-medium cursor-pointer">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span>Is this a combo ticket?</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground ml-1 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white p-3 shadow-lg">
                          <p className="max-w-xs">
                            Combo tickets bundle multiple events or experiences together at a discounted price.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Switch
                    id="isCombo"
                    checked={formik.values.isCombo}
                    onCheckedChange={(checked) => formik.setFieldValue("isCombo", checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                {formik.values.isCombo && (
                  <p className="text-xs text-blue-700 mt-2 bg-blue-100 p-3 rounded border-l-2 border-blue-500 animate-fade-in">
                    This ticket will be sold as a combo package. Make sure to correctly configure which dates, venues and time slots this applies to.
                  </p>
                )}
              </div>

              {/* Description Items */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description" className="font-medium">
                  Description Items
                </Label>
                {descriptionItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateDescriptionItem(index, e.target.value)}
                      placeholder={`Description item ${index + 1}`}
                      rows={2}
                      className="hover:border-primary focus:border-primary transition-colors"
                    />
                    <div className="flex flex-col space-y-2 mt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDescriptionItem(index)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                        disabled={descriptionItems.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDescriptionItem}
                  className="mt-2 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <PlusCircle className="h-3 w-3 mr-1" /> Add Description Item
                </Button>
              </div>

              <div className="space-y-4 sm:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-medium text-gray-700 flex items-center bg-slate-100 p-2 rounded-md">
                  <Tag className="h-4 w-4 mr-2 text-gray-600" />
                  Availability Settings
                </h4>
              </div>

              {/* Date Availability Section with Badge Selection */}
              <div className="space-y-2 sm:col-span-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Label className="flex items-center space-x-2 mb-2 font-medium">
                  <CalendarRange className="h-4 w-4 text-indigo-600" />
                  <span>Date Availability</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {dates.length > 0 ? (
                    dates.map((date) => {
                      const isSelected = selectedDates.includes(date.id);
                      return (
                        <Badge
                          key={date.id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() =>
                            toggleSelection(date.id, selectedDates, setSelectedDates, "availableDateIds")
                          }
                          className="cursor-pointer hover:bg-indigo-100 transition-colors"
                        >
                          {format(formatEventDate(date.startDate), "MMM d, yyyy")}
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      You need to add event dates first.
                    </p>
                  )}
                </div>
              </div>

              {/* Venue Availability Section with Badge Selection */}
              <div className="space-y-2 sm:col-span-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Label className="flex items-center space-x-2 mb-2 font-medium">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Venue Availability</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {venues.length > 0 ? (
                    venues.map((venue) => {
                      const isSelected = selectedVenues.includes(venue.id);
                      return (
                        <Badge
                          key={venue.id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() =>
                            toggleSelection(venue.id, selectedVenues, setSelectedVenues, "venueIds")
                          }
                          className="cursor-pointer hover:bg-emerald-100 transition-colors"
                        >
                          {venue.name} ({venue.city})
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      You need to add venues first.
                    </p>
                  )}
                </div>
              </div>

              {/* Time Slot Availability Section with Badge Selection */}
              <div className="space-y-2 sm:col-span-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Label className="flex items-center space-x-2 mb-2 font-medium">
                  <Clock className="h-4 w-4 text-violet-600" />
                  <span>Time Slot Availability</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlots.includes(slot.id);
                      const date = dates.find((d) => d.id === slot.dateId);
                      return (
                        <Badge
                          key={slot.id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() =>
                            toggleSelection(
                              slot.id,
                              selectedTimeSlots,
                              setSelectedTimeSlots,
                              "availableTimeSlotIds"
                            )
                          }
                          className="cursor-pointer hover:bg-violet-100 transition-colors"
                        >
                          {slot.startTime} - {slot.endTime}
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      You need to add time slots first.
                    </p>
                  )}
                </div>
              </div>

              {/* Limited Time Offer Section */}
              <div className="space-y-2 sm:col-span-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Label className="flex items-center space-x-2 mb-2 font-medium">
                  <Tag className="h-4 w-4 text-amber-600" />
                  <span>Limited Time Offer</span>
                </Label>
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="isLimited"
                    checked={formik.values.isLimited}
                    onCheckedChange={(checked) => formik.setFieldValue("isLimited", checked)}
                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  <Label htmlFor="isLimited" className="cursor-pointer">
                    Set sale period
                  </Label>
                </div>
                {formik.values.isLimited && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="saleStartDate" className="flex items-center">
                        Sale Start Date <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="saleStartDate"
                        name="saleStartDate"
                        type="date"
                        value={
                          formik.values.saleStartDate
                            ? format(new Date(formik.values.saleStartDate), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`hover:border-amber-400 focus:border-amber-500 transition-colors ${getFieldError("saleStartDate") ? "border-destructive" : ""
                          }`}
                      />
                      {getFieldError("saleStartDate") && (
                        <p className="text-destructive text-xs mt-1">{getFieldError("saleStartDate")}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saleEndDate" className="flex items-center">
                        Sale End Date <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="saleEndDate"
                        name="saleEndDate"
                        type="date"
                        value={
                          formik.values.saleEndDate
                            ? format(new Date(formik.values.saleEndDate), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`hover:border-amber-400 focus:border-amber-500 transition-colors ${getFieldError("saleEndDate") ? "border-destructive" : ""
                          }`}
                      />
                      {getFieldError("saleEndDate") && (
                        <p className="text-destructive text-xs mt-1">{getFieldError("saleEndDate")}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-primary hover:bg-primary/90 flex items-center hover:shadow-md transition-all">
                {isEditMode ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" /> Update Ticket
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Ticket
                  </>
                )}
              </Button>
            </div>
          </form>

          <Card className="mt-8 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="py-4 bg-gradient-to-r from-gray-50 to-indigo-50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" />
                Added Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticketList.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="w-[30%]">Name</TableHead>
                      <TableHead className="w-[15%]">Type</TableHead>
                      <TableHead className="w-[15%]">Price</TableHead>
                      <TableHead className="w-[15%]">Quantity</TableHead>
                      <TableHead className="w-[15%]">Value</TableHead>
                      <TableHead className="w-[10%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketList.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-blue-50/80 transition-colors">
                        <TableCell>
                          <div className="font-medium">{ticket.name}</div>
                          <div className="text-xs flex items-center space-x-1">
                            <span className="text-muted-foreground">{getTicketCategoryLabel(ticket.ticketCategory)}</span>
                            {ticket.isCombo && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                Combo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ticket.ticketType === "free" ? "outline" : "default"} className={ticket.ticketType === "free" ? "border-green-300 text-green-700 bg-green-50" : ""}>
                            {ticket.ticketType === "free" ? "Free" : "Paid"}
                          </Badge>
                        </TableCell>
                        <TableCell>{ticket.ticketType === "free" ? "Free" : formatIndianPrice(ticket.price)}</TableCell>
                        <TableCell>{ticket.quantity.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{formatIndianPrice(ticket.price * ticket.quantity)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-1 justify-end">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editTicket(ticket.id)}
                                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-2 shadow-lg">
                                  <p>Edit this ticket</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTicket(ticket.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:bg-red-100 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-2 shadow-lg">
                                  <p>Delete this ticket</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total Value:
                      </TableCell>
                      <TableCell className="font-bold text-gray-700">
                        {formatIndianPrice(totalValue)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <div className="py-16 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Tag className="h-16 w-16 text-gray-300 animate-pulse" strokeWidth={1.5} />
                    <div className="space-y-2">
                      <p className="text-lg">No tickets added yet</p>
                      <p className="text-sm">Use the form above to add tickets to your event</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("name")?.focus()}
                      className="mt-4 hover:bg-primary/10 transition-colors"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Start Adding Tickets
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
                <Badge variant="outline" className="mr-2 bg-primary text-white">
                  {ticketList.length}
                </Badge>
                <span className="text-gray-700">Tickets</span>
              </div>
              <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
                <Badge variant="outline" className="mr-2 bg-primary text-white">
                  {formatIndianPrice(totalValue)}
                </Badge>
                <span className="text-gray-700">Total Value</span>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => {
                if (ticketList.length === 0) {
                  toast({
                    title: "No tickets added",
                    description: "Please add at least one ticket for your event.",
                    variant: "destructive",
                  });
                  return;
                }
                onSubmit(ticketList);
              }}
              className="flex items-center bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              Next: Media <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { TicketStep };
